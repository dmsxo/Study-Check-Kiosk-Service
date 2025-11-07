#include <SoftwareSerial.h>
#include <string.h>

// ── Wiring ───────────────────────────────────────────────
// Module TX → D11 (Arduino RX), Module RX → D10 (Arduino TX)
SoftwareSerial scanner(9, 8);

// ── Packets ──────────────────────────────────────────────
const uint8_t SCAN_TRIGGER[] = {0x7E,0x00,0x08,0x01,0x00,0x02,0x01,0xAB,0xCD}; // trigger
const uint8_t SCAN_CANCEL[]  = {0x7E,0x00,0x08,0x01,0x00,0x02,0x00,0xAB,0xCD}; // cancle
const uint8_t ACK_PKT[]      = {0x02,0x00,0x00,0x01,0x00,0x33,0x31};            // ACK

// (초기 1회) 스캔 시간 10초로 설정 및 플래시에 저장
const uint8_t SET_10S[]      = {0x7E,0x00,0x08,0x01,0x00,0x06,0x64,0xAB,0xCD}; // 0x64 = 10.0s
const uint8_t SAVE_FLASH[]   = {0x7E,0x00,0x09,0x01,0x00,0x00,0x00,0xDE,0xC8};

// 아두이노가 결과를 기다릴 시간(센서와 동기화: 10초)
const unsigned long SCAN_WINDOW_MS = 10000;


// ── Helpers ──────────────────────────────────────────────
// 트리거 직후 들어오는 ACK 시퀀스를 조용히 버린다.
bool discardAck(unsigned long timeout_ms = 100) {
  size_t idx = 0;
  unsigned long t0 = millis();
  while (millis() - t0 < timeout_ms && idx < sizeof(ACK_PKT)) {
    if (scanner.available()) {
      uint8_t v = scanner.read();
      if (v == ACK_PKT[idx]) idx++;
      else return false; // ACK 형태가 아니면 즉시 중단
    }
  }
  return (idx == sizeof(ACK_PKT));
}

void clearScannerBuffer() {
  while (scanner.available()) scanner.read();
}

// 출력 가능한 ASCII(0x20~0x7E)만 내보내고, CR/LF는 개행 처리
void readBarcodeWindow(unsigned long ms) {
  unsigned long t0 = millis();
  String data = "";
  while (millis() - t0 < ms) {
    if(Serial.available() && Serial.read() == 'c'){
      scanner.write(SCAN_CANCEL, sizeof(SCAN_CANCEL));
      scanner.flush();
      break;
    } 
    if (scanner.available()) {
      char c = scanner.read();
      if (c == '\r' || c == '\n') {
        Serial.println(data);
      } else if (c >= 0x20 && c <= 0x7E) {
        data += c;
      }
      // 그 외(제어/이진 바이트)는 무시
    }
  }
  // 잔여 ACK 버리기
  clearScannerBuffer();
  if(data == "") Serial.println("404");
}

// ── Setup / Loop ─────────────────────────────────────────
void setup() {
  Serial.begin(115200);
  scanner.begin(9600);
}

void loop() {
  if (Serial.available()) {
    char cmd = Serial.read();
    if (cmd == 's') {
      clearScannerBuffer();
      // 1) 트리거 전송
      scanner.write(SCAN_TRIGGER, sizeof(SCAN_TRIGGER));
      scanner.flush();

      // 2) 즉시 들어오는 ACK를 조용히 버림(모니터에 안 보이게)
      discardAck(120);

      // 3) 10초 동안 디코딩된 문자열만 표시
      readBarcodeWindow(SCAN_WINDOW_MS);

      // 정리용
      scanner.write(SCAN_CANCEL, sizeof(SCAN_CANCEL));
      scanner.flush();
    }
  }
}
