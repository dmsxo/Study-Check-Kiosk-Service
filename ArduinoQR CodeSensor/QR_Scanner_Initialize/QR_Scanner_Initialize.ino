#include <SoftwareSerial.h>

// ── Wiring ───────────────────────────────────────────────
// Module TX → D9 (Arduino RX), Module RX → D8 (Arduino TX)
SoftwareSerial scanner(9, 8);

// ── Utils ────────────────────────────────────────────────
void sendBytes(const uint8_t *p, size_t n)
{
  scanner.write(p, n);
  scanner.flush();
}

// WRITE 1B: 7E 00 08 01 [addrH] [addrL] [val] AB CD
void writeReg(uint16_t addr, uint8_t val)
{
  uint8_t pkt[] = {0x7E, 0x00, 0x08, 0x01, (uint8_t)(addr >> 8), (uint8_t)(addr & 0xFF), val, 0xAB, 0xCD};
  sendBytes(pkt, sizeof(pkt));
  delay(15);
}

// READ 1B: 7E 00 08 07 [addrH] [addrL] 01 AB CD  → 단순히 첫 1바이트만 회수
int readReg1(uint16_t addr)
{
  uint8_t pkt[] = {0x7E, 0x00, 0x08, 0x07, (uint8_t)(addr >> 8), (uint8_t)(addr & 0xFF), 0x01, 0xAB, 0xCD};
  sendBytes(pkt, sizeof(pkt));
  unsigned long t0 = millis();
  while (millis() - t0 < 200)
  {
    if (scanner.available())
      return (uint8_t)scanner.read();
  }
  return -1; // timeout
}

// Save to flash: 7E 00 09 01 00 00 00 DE C8
void saveToFlash()
{
  const uint8_t SAVE[] = {0x7E, 0x00, 0x09, 0x01, 0x00, 0x00, 0x00, 0xDE, 0xC8};
  sendBytes(SAVE, sizeof(SAVE));
  delay(60);
}

// (옵션) 공장초기화: addr 0x00D9, val 0x50  (펌웨어에 따라 지원)
void factoryReset()
{
  writeReg(0x00D9, 0x50);
  delay(300);
}

// ── 원하는 초기값 ─────────────────────────────────────────
// 0x0000 = 0x05 → Silence + Command Mode + Standard LED/Target
const uint8_t INIT_MODE_SILENCE_CMD = 0x05;

// 0x0006 = 0x64 → Single scanning time = 10.0 s (0.1s 단위)
const uint8_t INIT_SINGLE_SCAN_TIME = 0x64;

// 0x003F = 0x01 → Enable QR
const uint8_t INIT_QR_ENABLE = 0x01;

// 0x0120 = 0x01 → Whole Area Scan Enable
const uint8_t INIT_WHOLE_AREA = 0x01;

// 0x0121 = 0x01 → Scan Enhance Enable
const uint8_t INIT_SCAN_ENHANCE = 0x01;

void setup()
{
  Serial.begin(115200);
  scanner.begin(9600);
  delay(300);

  Serial.println(F("\n=== BARCODE MODULE OPTIMIZED INITIALIZER ==="));
  Serial.println(F("Applying: Silence + Command + WholeArea + Enhance + QR + 10s..."));

  // (필요시) 공장초기화
  // factoryReset();

  writeReg(0x0000, INIT_MODE_SILENCE_CMD);
  writeReg(0x0006, INIT_SINGLE_SCAN_TIME);
  writeReg(0x003F, INIT_QR_ENABLE);
  writeReg(0x0120, INIT_WHOLE_AREA);
  writeReg(0x0121, INIT_SCAN_ENHANCE);

  saveToFlash();

  // 값 검증 출력
  Serial.print(F("0x0000 (mode/silence)        = 0x"));
  Serial.println(readReg1(0x0000), HEX);
  Serial.print(F("0x0006 (single scan time)    = 0x"));
  Serial.println(readReg1(0x0006), HEX);
  Serial.print(F("0x003F (QR enable)           = 0x"));
  Serial.println(readReg1(0x003F), HEX);
  Serial.print(F("0x0120 (whole area scan)     = 0x"));
  Serial.println(readReg1(0x0120), HEX);
  Serial.print(F("0x0121 (scan enhance)        = 0x"));
  Serial.println(readReg1(0x0121), HEX);

  Serial.println(F("✔ Initialization complete."));
  Serial.println(F("⚠️ Power-cycle the sensor (OFF/ON)!"));
}

void loop()
{
  // Nothing here — one time initialization only.
}
