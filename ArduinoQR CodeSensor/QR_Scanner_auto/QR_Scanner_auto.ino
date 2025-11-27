#include <SoftwareSerial.h>
SoftwareSerial scanner(9, 8);  // RX, TX ← 그대로

// 정답 패킷 (CRC 무시하고 0xABCD 때려박기)
const uint8_t SCAN_START[]  = {0x7E, 0x00, 0x08, 0x01, 0x00, 0x02, 0x01, 0xAB, 0xCD};
const uint8_t SCAN_STOP[]   = {0x7E, 0x00, 0x08, 0x01, 0x00, 0x02, 0x00, 0xAB, 0xCD};
const uint8_t ACK[] = {0x02, 0x00, 0x00, 0x01, 0x00, 0x33, 0x31};

String result = "";
bool scanning = false;
unsigned long startTime = 0;
const unsigned long TIMEOUT = 10000;  // 10초

void clearBuffer() {
  while (scanner.available()) scanner.read();
}

void discardAck() {
  unsigned long t = millis();
  int idx = 0;
  while (millis() - t < 200 && idx < 7) {
    if (scanner.available() && scanner.read() == ACK[idx]) idx++;
    else idx = 0;
  }
}

void setup() {
  Serial.begin(115200);
  scanner.begin(9600);
  delay(500);
}

void loop() {
  // s 누르면 시작
  if (Serial.available()) {
    char cmd = Serial.read();
    if (cmd == 's' || cmd == 'S') {
      if (scanning) return;
      scanning = true;
      startTime = millis();
      result = "";
      
      clearBuffer();
      scanner.write(SCAN_START, 9);
      discardAck();
    }
    
    if (cmd == 'c' || cmd == 'C') {
      if (scanning) {
        scanner.write(SCAN_STOP, 9);
        scanning = false;
        if (result.length() == 0) Serial.println("404");
        else Serial.println(result);
        result = "";
      }
    }
  }

  // 스캐너에서 데이터 읽기
  while (scanner.available() && scanning) {
  char c = scanner.read();
//  Serial.print(c);

  if (c == '\n') {
    scanning = false;
    Serial.println(result);
    scanner.write(SCAN_STOP, 9);
    result = "";
  } else if (c != '\r') {
    result += c;
  }
}

  // 10초 타임아웃
  if (scanning && millis() - startTime > TIMEOUT) {
    scanning = false;
    scanner.write(SCAN_STOP, 9);
    Serial.println("404");
    result = "";
  }
}
