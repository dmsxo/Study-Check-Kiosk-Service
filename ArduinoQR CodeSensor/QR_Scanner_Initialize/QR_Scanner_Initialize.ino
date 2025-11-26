#include <SoftwareSerial.h>

// ── Wiring ───────────────────────────────────────────────
// Module TX → D11 (Arduino RX), Module RX → D10 (Arduino TX)
SoftwareSerial scanner(9, 8);

// ── Utils ────────────────────────────────────────────────
void sendBytes(const uint8_t* p, size_t n) { scanner.write(p, n); scanner.flush(); }

// WRITE 1B: 7E 00 08 01 [addrH] [addrL] [val] AB CD
void writeReg(uint16_t addr, uint8_t val) {
  uint8_t pkt[] = {0x7E,0x00,0x08,0x01,(uint8_t)(addr>>8),(uint8_t)(addr&0xFF),val,0xAB,0xCD};
  sendBytes(pkt, sizeof(pkt));
  delay(1000);
}

// READ 1B: 7E 00 08 07 [addrH] [addrL] 01 AB CD  → 단순히 첫 1바이트만 회수
int readReg1(uint16_t addr) {
  uint8_t pkt[] = {0x7E,0x00,0x08,0x07,(uint8_t)(addr>>8),(uint8_t)(addr&0xFF),0x01,0xAB,0xCD};
  sendBytes(pkt, sizeof(pkt));
  unsigned long t0 = millis();
  while (millis() - t0 < 1000) { if (scanner.available()) return (uint8_t)scanner.read(); }
  return -1; // timeout
}

// Save to flash: 7E 00 09 01 00 00 00 DE C8
void saveToFlash() {
  const uint8_t SAVE[] = {0x7E,0x00,0x09,0x01,0x00,0x00,0x00,0xDE,0xC8};
  sendBytes(SAVE, sizeof(SAVE));
  delay(1000);
}

// (옵션) 공장초기화: addr 0x00D9, val 0x50  (펌웨어에 따라 지원)
void factoryReset() {
  writeReg(0x00D9, 0x50);
  delay(1000);
}

// ── 원하는 초기값 (필요 시만 수정) ─────────────────────
// 0x0000 = 0x15 → Command(01) + Lighting Std(01) + Targeting Std(01)
const uint8_t INIT_MODE_LIGHT_TARGET = 0x15;
// 0x0006 = 0x64 → Single scanning time = 10.0 s  (0.1s 단위)
const uint8_t INIT_SINGLE_SCAN_TIME  = 0x64;
// 0x003F = 0x01 → Enable QR
const uint8_t INIT_QR_ENABLE         = 0x01;

void setup() {
  Serial.begin(115200);
  scanner.begin(9600);
  delay(300);

  Serial.println(F("\n=== BARCODE MODULE ONE-SHOT INITIALIZER ==="));
  Serial.println(F("Applying preset and saving to flash..."));

  // (필요하면) 공장초기화 먼저
//   factoryReset();
//
//  // 1) 모드/조명/타겟
  writeReg(0x0000, INIT_MODE_LIGHT_TARGET);
  // 2) 단일 스캔 시간
  writeReg(0x0006, INIT_SINGLE_SCAN_TIME);
  // 3) QR 사용
  writeReg(0x003F, INIT_QR_ENABLE);

  // 4) 플래시에 저장
  saveToFlash();

  // 5) 적용값 간단 검증 출력
  int v0000 = readReg1(0x0000);
  delay(1000);
  int v0006 = readReg1(0x0006);
  delay(1000);
  int v003F = readReg1(0x003F);
  delay(1000);

  Serial.print(F("0x0000 (mode/light/target) = 0x")); Serial.println(v0000, HEX);
  Serial.print(F("0x0006 (single scan time)  = 0x")); Serial.println(v0006, HEX);
  Serial.print(F("0x003F (QR enable)         = 0x")); Serial.println(v003F, HEX);

  Serial.println(F("[DONE] Initialization complete. You can now power-cycle the sensor."));
}

void loop() {
  // Nothing to do. This sketch is "initialize once and done".
}
