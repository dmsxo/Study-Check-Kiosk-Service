#include <SoftwareSerial.h>

// Wiring
SoftwareSerial scanner(9, 8);

// ───────────────────────────────────────────────
// Utils
// ───────────────────────────────────────────────

// 버퍼 비우기 (안전성 증가)
void clearSerial(SoftwareSerial &s)
{
  while (s.available())
    s.read();
  delay(3);
}

void sendBytes(const uint8_t *p, size_t n)
{
  clearSerial(scanner); // 이전 패킷 잔여 삭제
  scanner.write(p, n);
  scanner.flush();
}

// ───────────────────────────────────────────────
// WRITE (완전 안전 버전)
// ───────────────────────────────────────────────
// 공식 포맷: 7E 00 08 LEN ADDRH ADDRL DATA CRC CRC
void writeReg(uint16_t addr, uint8_t val)
{
  uint8_t pkt[] = {
      0x7E, 0x00,
      0x08,
      0x01, // 1 byte write
      (uint8_t)(addr >> 8), (uint8_t)(addr & 0xFF),
      val,
      0xAB, 0xCD};

  sendBytes(pkt, sizeof(pkt));
  delay(50); // ← 안정성을 위해 50ms 확보
}

// ───────────────────────────────────────────────
// READ (완전 안전 버전)
// ───────────────────────────────────────────────
int readReg1(uint16_t addr)
{
  uint8_t pkt[] = {
      0x7E, 0x00,
      0x07, // READ
      0x01,
      (uint8_t)(addr >> 8), (uint8_t)(addr & 0xFF),
      0x01, // read 1 byte
      0xAB, 0xCD};

  sendBytes(pkt, sizeof(pkt));

  uint8_t buf[20];
  int idx = 0;
  unsigned long t0 = millis();

  // 타임아웃 300ms 증가
  while (millis() - t0 < 300)
  {
    while (scanner.available())
    {
      if (idx < (int)sizeof(buf))
        buf[idx++] = scanner.read();
    }

    // 최소 응답 길이인 7바이트 도달 시 break
    if (idx >= 7)
      break;
  }

  if (idx < 7)
    return -1; // Timeout
  if (buf[0] != 0x02 || buf[1] != 0x00)
    return -2; // Bad header
  if (buf[2] != 0x00)
    return -3; // BAD read status
  if (buf[3] != 0x01)
    return -4; // Not length=1

  return buf[4];
}

// ───────────────────────────────────────────────
// SAVE to Flash (완전 안전)
// ───────────────────────────────────────────────
void saveToFlash()
{
  uint8_t pkt[] = {
      0x7E, 0x00,
      0x09,
      0x01,
      0x00, 0x00, 0x00,
      0xDE, 0xC8};
  sendBytes(pkt, sizeof(pkt));

  // Flash write time 최악값 여유 포함
  delay(300); // 기존 60 → 최소 250 이상 필요. 300ms 안전.
}

// ───────────────────────────────────────────────
// FACTORY RESET (가장 안전한 값)
// ───────────────────────────────────────────────
void factoryReset()
{
  writeReg(0x00D9, 0x50);

  // EEPROM 전체 리셋 + 내부 MCU 재초기화 여유
  delay(1000);
}

// ───────────────────────────────────────────────
// Init Values
// ───────────────────────────────────────────────

const uint8_t INIT_MODE_SILENCE_CMD = 0x01;
const uint8_t INIT_SINGLE_SCAN_TIME = 0x64;
const uint8_t INIT_QR_ENABLE = 0x01;
const uint8_t INIT_WHOLE_AREA = 0x01;
const uint8_t INIT_SCAN_ENHANCE = 0x01;

// ───────────────────────────────────────────────
// SETUP
// ───────────────────────────────────────────────
void setup()
{
  Serial.begin(115200);
  delay(5000);
  scanner.begin(9600);
  delay(5000); // 기기 부팅 안정 구간

  Serial.println(F("\n=== SAFE BARCODE INIT START ==="));

  // 필요시
   factoryReset();
   delay(5000);

  writeReg(0x0000, INIT_MODE_SILENCE_CMD);
  writeReg(0x0006, INIT_SINGLE_SCAN_TIME);
  writeReg(0x003F, INIT_QR_ENABLE);
  writeReg(0x0120, INIT_WHOLE_AREA);
  writeReg(0x0121, INIT_SCAN_ENHANCE);

  saveToFlash();

  // 검증
  Serial.print(F("0x0000: "));
  Serial.println(readReg1(0x0000), HEX);
  Serial.print(F("0x0006: "));
  Serial.println(readReg1(0x0006), HEX);
  Serial.print(F("0x003F: "));
  Serial.println(readReg1(0x003F), HEX);
  Serial.print(F("0x0120: "));
  Serial.println(readReg1(0x0120), HEX);
  Serial.print(F("0x0121: "));
  Serial.println(readReg1(0x0121), HEX);

  Serial.println(F("=== SAFE INIT DONE ==="));
}

void loop() {}
