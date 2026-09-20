// Inisialisasi setup() dan loop()
#include <Arduino.h>
#include "config/pinout.h"
#include "config/threshold.h"

void setup() {
    Serial.begin(115200);
    Serial.println("Ice-TEMBOX Firmware Starting...");
}

void loop() {
    // Main execution loop
    delay(1000);
}
