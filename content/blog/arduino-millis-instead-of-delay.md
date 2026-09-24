---
title: "Arduino: Why You Should Use millis() Instead of delay()"
description: "delay() freezes your whole Arduino. Learn the millis() pattern to blink LEDs, read buttons and update a display at the same time."
date: "2026-09-12"
tags: ["Arduino", "C++", "Hardware", "Electronics"]
cover: null
---

You want to blink an LED **and** read a button. You use `delay(1000)` for the blink, and now the button only works if you press it at exactly the right moment.

> **Quick answer:** `delay()` stops the entire program. Use `millis()` to check "has enough time passed?" instead, so your loop never blocks.

---

## Why delay() is a problem

```cpp
void loop() {
  digitalWrite(LED, HIGH);
  delay(1000);            // nothing else can run here for 1 second
  digitalWrite(LED, LOW);
  delay(1000);            // ...or here
}
```

During those two seconds the Arduino ignores buttons, sensors, serial data — everything. That's fine for a demo, and terrible for a real project (like a clock that has to update a display, check a button and blink a colon at the same time).

---

## The millis() pattern

`millis()` returns the milliseconds since the board started. Instead of waiting, you **remember when you last did something** and compare.

```cpp
const int LED = 13;
const unsigned long INTERVAL = 1000;

unsigned long previousMillis = 0;
bool ledState = false;

void setup() {
  pinMode(LED, OUTPUT);
}

void loop() {
  unsigned long now = millis();

  if (now - previousMillis >= INTERVAL) {
    previousMillis = now;
    ledState = !ledState;
    digitalWrite(LED, ledState);
  }

  // Anything else runs freely here, every loop
}
```

`loop()` now runs thousands of times per second, and the blink code only acts once per interval.

---

## Do multiple things at once

Each task gets its own timestamp:

```cpp
unsigned long lastBlink = 0;
unsigned long lastSensor = 0;

void loop() {
  unsigned long now = millis();

  if (now - lastBlink >= 500) {
    lastBlink = now;
    toggleLed();
  }

  if (now - lastSensor >= 2000) {
    lastSensor = now;
    readTemperature();
  }

  checkButton(); // runs every loop, no delay
}
```

Now the button is responsive, the LED blinks and the sensor is polled — all independently.

---

## The rules

1. **Use `unsigned long`** for time variables. `int` overflows after about 32 seconds.
2. **Always subtract** (`now - previous >= interval`) rather than comparing (`now >= previous + interval`). The subtraction keeps working correctly when `millis()` wraps around after about 49 days.
3. **Update the timestamp** inside the `if`, otherwise the code runs every loop.

---

## Is delay() ever OK?

Yes: in `setup()`, in quick tests, or in a project that truly does one thing. The moment you need two things at once, switch to `millis()`.

---

## Checklist

- ✅ No `delay()` in `loop()` for anything longer than a few milliseconds
- ✅ Each timed task has its own `unsigned long` timestamp
- ✅ Time is compared using subtraction
- ✅ Timestamps are refreshed inside the `if` block
