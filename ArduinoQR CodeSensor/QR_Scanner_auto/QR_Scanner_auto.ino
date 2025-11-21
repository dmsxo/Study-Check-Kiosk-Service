#include <SoftwareSerial.h>

SoftwareSerial scanner(9, 8);

// ───────────────────────────────────────
// 패킷 읽기
// ───────────────────────────────────────
bool readPacket(uint8_t *buf, size_t &length, unsigned long timeout = 500)
{
  unsigned long t0 = millis();
  size_t idx = 0;

  while (millis() - t0 < timeout)
  {
    while (scanner.available())
    {
      uint8_t b = scanner.read();

      // 첫 바이트 = 0x02일 때만 패킷 시작
      if (idx == 0 && b != 0x02)
        continue;

      buf[idx++] = b;

      // 최소 4바이트(헤더 + 길이) 확보 후 길이를 계산
      if (idx == 4)
      {
        uint8_t dataLen = buf[3];
        // 전체 패킷 길이 = 4 + dataLen + 2(CRC)
        length = 4 + dataLen + 2;
      }

      // 목표 길이에 도달하면 패킷 완성
      if (idx > 4 && idx == length)
        return true;

      // 오버플로 방지
      if (idx >= 200)
        return false;
    }
  }
  return false;
}

// ───────────────────────────────────────
// 스캔 트리거
// ───────────────────────────────────────
void triggerScan()
{
  uint8_t cmd[] = {0x7E, 0x00, 0x08, 0x01, 0x00, 0x02, 0x01, 0xAB, 0xCD};
  scanner.write(cmd, sizeof(cmd));
}

// 스캔 취소
void cancelScan()
{
  uint8_t cmd[] = {0x7E, 0x00, 0x08, 0x01, 0x00, 0x02, 0x00, 0xAB, 0xCD};
  scanner.write(cmd, sizeof(cmd));
}

// ───────────────────────────────────────
// 스캔 수행 (10초 타임아웃)
// ───────────────────────────────────────
bool scanOnce(String &result)
{
  triggerScan();

  uint8_t pkt[200];
  size_t pktLen = 0;

  unsigned long t0 = millis();
  while (millis() - t0 < 10000)
  {
    // cancel 입력
    if (Serial.available() && Serial.read() == 'c')
    {
      cancelScan();
      return false;
    }

    // 패킷 수신
    if (readPacket(pkt, pktLen, 50))
    {
      if (pkt[0] == 0x02 && pkt[1] == 0x00)
      {
        uint8_t len = pkt[3];
        result = "";

        for (int i = 0; i < len; i++)
        {
          char c = pkt[4 + i];
          result += c;
        }
        return true;
      }
    }
  }

  cancelScan();
  return false;
}

// ───────────────────────────────────────
// Setup / Loop
// ───────────────────────────────────────
void setup()
{
  Serial.begin(115200);
  scanner.begin(9600);
  Serial.println("Scanner ready. (press 's' to scan)");
}

void loop()
{
  if (Serial.available())
  {
    if (Serial.read() == 's')
    {
      String data;
      Serial.println("Scanning... (press 'c' to cancel)");

      if (scanOnce(data))
        Serial.println("RESULT = " + data);
      else
        Serial.println("Scan failed or canceled.");
    }
  }
}
