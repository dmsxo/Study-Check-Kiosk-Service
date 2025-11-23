#include <SoftwareSerial.h>
SoftwareSerial scanner(9, 8);

#define SCANNER_BAUD 9600

bool readPacket(uint8_t *buf, size_t &len, unsigned long timeout = 500) {
  unsigned long t0 = millis();
  size_t idx = 0;

  while (millis() - t0 < timeout) {
    while (scanner.available()) {
      uint8_t b = scanner.read();

      // 시작바이트 0x02
      if (idx == 0 && b != 0x02) continue;

      buf[idx++] = b;

      // 길이 정보 확보
      if (idx == 4) {
        uint8_t L = buf[3];
        len = 4 + L + 2;
      }

      if (idx > 4 && idx == len) return true;

      if (idx >= 200) return false;
    }
  }
  return false;
}

void triggerScan() {
  uint8_t cmd[] = {0x7E,0x00,0x08,0x01,0x00,0x02,0x01,0xAB,0xCD};
  scanner.write(cmd, sizeof(cmd));
}

void cancelScan() {
  uint8_t cmd[] = {0x7E,0x00,0x08,0x01,0x00,0x02,0x00,0xAB,0xCD};
  scanner.write(cmd, sizeof(cmd));
}

bool scanOnce(String &result) {
  triggerScan();

  uint8_t pkt[200];
  size_t pktLen;

  unsigned long t0 = millis();
  while (millis() - t0 < 8000) {

    if (readPacket(pkt, pktLen, 50)) {
      if (pkt[0] == 0x02 && pkt[1] == 0x00) {
        uint8_t L = pkt[3];
        result = "";
        for (int i = 0; i < L; i++) {
          result += (char)pkt[4+i];
        }
        return true;
      }
    }
  }

  cancelScan();
  return false;
}

void setup() {
  Serial.begin(115200);
  scanner.begin(SCANNER_BAUD);
  Serial.println("Scanner Ready. Press 's' to scan.");
}

void loop() {
  if (Serial.available()) {
    if (Serial.read() == 's') {
      String out;
      Serial.println("Scanning...");

      if (scanOnce(out))
        Serial.println("RESULT = " + out);
      else
        Serial.println("Fail.");
    }
  }
}
