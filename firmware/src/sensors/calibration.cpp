// Offset kalibrasi sensor sebelum logging
#include <Arduino.h>

float applyCalibrationOffset(float rawTemp, float offset) {
    return rawTemp + offset;
}
