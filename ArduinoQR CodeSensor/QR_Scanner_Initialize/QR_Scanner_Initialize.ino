#include <SoftwareSerial.h>
SoftwareSerial scanner(9, 8);  // ← 여기만 당신 핀으로 바꾸세요

// 매뉴얼에 있는 C 코드 100% 그대로 복사한 CRC-CCITT
uint16_t crc16_ccitt(const uint8_t *data, size_t len) {
    uint16_t crc = 0;
    while (len--) {
        uint8_t x = (crc >> 8) ^ *data++;
        x ^= x >> 4;
        crc = (crc << 8) ^ (x << 12) ^ (x << 5) ^ x;
    }
    return crc;
}

// 간단한 헥사 출력 함수 (printf 대신)
void printHex(const uint8_t *buf, size_t len) {
    for (size_t i = 0; i < len; i++) {
        if (buf[i] < 0x10) Serial.print("0");
        Serial.print(buf[i], HEX);
        Serial.print(" ");
    }
    Serial.println();
}

// 1바이트 읽기 (매뉴얼 77~79페이지 예시랑 100% 동일)
bool scannerReadByte(uint16_t addr, uint8_t &value) {
    uint8_t cmd[9] = {0x7E, 0x00, 0x07, 0x01, highByte(addr), lowByte(addr), 0x01};
    uint16_t crc = crc16_ccitt(&cmd[2], 5);
    cmd[7] = crc >> 8;
    cmd[8] = crc & 0xFF;

    Serial.print("READ CMD  : ");
    printHex(cmd, 9);
    scanner.write(cmd, 9);

    uint8_t resp[7];
    unsigned long t = millis();
    while (scanner.available() < 7 && millis() - t < 1000);  // 최대 1초 대기

    if (scanner.available() < 7) {
        Serial.println(">>> READ TIMEOUT");
        return false;
    }

    for (int i = 0; i < 7; i++) resp[i] = scanner.read();

    Serial.print("READ RESP : ");
    printHex(resp, 7);

    if (resp[0] != 0x02 || resp[1] != 0x00 || resp[2] != 0x00 || resp[3] != 0x01) {
        Serial.println(">>> READ WRONG HEADER");
        return false;
    }
    value = resp[4];
    return true;
}

// 1바이트 쓰기
bool scannerWriteByte(uint16_t addr, uint8_t value) {
    uint8_t cmd[9] = {0x7E, 0x00, 0x08, 0x01, highByte(addr), lowByte(addr), value};
    uint16_t crc = crc16_ccitt(&cmd[2], 5);
    cmd[7] = crc >> 8;
    cmd[8] = crc & 0xFF;

    Serial.print("WRITE CMD : ");
    printHex(cmd, 9);
    scanner.write(cmd, 9);

    uint8_t ack[7];
    unsigned long t = millis();
    while (scanner.available() < 7 && millis() - t < 1000);

    if (scanner.available() < 7) {
        Serial.println(">>> WRITE TIMEOUT");
        return false;
    }

    for (int i = 0; i < 7; i++) ack[i] = scanner.read();
    Serial.print("WRITE ACK : ");
    printHex(ack, 7);

    return (ack[0] == 0x02 && ack[2] == 0x00 && ack[3] == 0x01 && ack[4] == 0x00);
}

// 플래시 저장
bool scannerSave() {
    uint8_t cmd[] = {0x7E, 0x00, 0x09, 0x01, 0x00, 0x00, 0x00, 0xDE, 0xC8};
    Serial.print("SAVE CMD  : ");
    printHex(cmd, 9);
    scanner.write(cmd, 9);

    uint8_t ack[7];
    unsigned long t = millis();
    while (scanner.available() < 7 && millis() - t < 1000);
    if (scanner.available() < 7) {
        Serial.println(">>> SAVE TIMEOUT");
        return false;
    }
    for (int i = 0; i < 7; i++) ack[i] = scanner.read();
    Serial.print("SAVE ACK  : ");
    printHex(ack, 7);
    return true;
}

void checkRegister(uint16_t addr) {
    uint8_t val;
    if (scannerReadByte(addr, val)) {
        Serial.print("Register 0x");
        if (addr < 0x100) Serial.print("0");
        Serial.print(addr, HEX);
        Serial.print(" = 0x");
        if (val < 0x10) Serial.print("0");
        Serial.println(val, HEX);
    } else {
        Serial.print(">>> FAILED 0x");
        Serial.println(addr, HEX);
    }
}

void setup() {
    Serial.begin(115200);
    scanner.begin(9600);
    delay(1000);

    Serial.println(F("\n=== WAVESHARE FINAL WORKING CODE ==="));

    // 1. 공장 초기화 (이게 제일 중요!!!)
    Serial.println("Factory reset...");
    scannerWriteByte(0x00D9, 0x50);
    scannerSave();
    delay(3000);

    // 2. 설정
    scannerWriteByte(0x0000, 0x15);   // Continuous mode
    scannerWriteByte(0x003F, 0x01);   // QR 코드 켜기
    scannerWriteByte(0x0006, 0x64);   // 스캔 간격
    scannerWriteByte(0x000E, 0x00); // HID 끄기
    scannerWriteByte(0x000D, 0x00); // Virtual keyboard 끄기
    scannerWriteByte(0x0060, 0x03); // Enable Suffix

    Serial.println("Saving...");
    scannerSave();
    delay(2000);

    // 3. 확인
    Serial.println("Reading registers...");
    checkRegister(0x0000);
    checkRegister(0x0006);
    checkRegister(0x003F);
    checkRegister(0x000E);
    checkRegister(0x000D);
    checkRegister(0x0060);
}

void loop() {
    // if (scanner.available()) Serial.write(scanner.read());
}