import math
import random


class LoadGenerator:
    def __init__(self):
        self.tick = 0
        self.pattern = "diurnal"
        self.base_load = 500
        self.walk_value = 500
        self.spike_remaining = 0

    def set_pattern(self, pattern: str):
        self.pattern = pattern
        self.tick = 0
        self.walk_value = 500
        self.spike_remaining = 0

    def get_load(self) -> int:
        self.tick += 1
        t = self.tick

        if self.pattern == "flat":
            return self.base_load

        elif self.pattern == "step":
            if t < 15:
                return 200
            elif t < 30:
                return 2000
            elif t < 50:
                return 6000
            elif t < 70:
                return 1500
            elif t < 90:
                return 4000
            elif t < 110:
                return 800
            else:
                return 200

        elif self.pattern == "spike":
            if self.spike_remaining <= 0 and t % 40 == 0:
                self.spike_remaining = 6
            if self.spike_remaining > 0:
                self.spike_remaining -= 1
                return 8000 + int(random.gauss(0, 200))
            return self.base_load + int(100 * math.sin(t * 0.1))

        elif self.pattern == "diurnal":
            base = 300 + 1700 * (0.5 + 0.5 * math.sin(t * 0.05 - math.pi / 2))
            noise = random.gauss(0, 80)
            return max(10, int(base + noise))

        elif self.pattern == "random_walk":
            self.walk_value += random.gauss(0, 60)
            self.walk_value = max(10, min(10000, self.walk_value))
            return int(self.walk_value)

        elif self.pattern == "chaotic":
            phase = t % 100
            if phase < 15:
                return int(200 + random.gauss(0, 30))
            elif phase < 25:
                return int(6000 + random.gauss(0, 300))
            elif phase < 50:
                base = 300 + 1700 * (0.5 + 0.5 * math.sin(t * 0.1))
                return max(10, int(base))
            elif phase < 60:
                return int(100 + random.gauss(0, 20))
            elif phase < 75:
                return int(3000 + random.gauss(0, 200))
            else:
                return int(1000 + 500 * math.sin(t * 0.15))

        elif self.pattern == "edos":
            cycle = t % 12
            if cycle < 4:
                return 850
            elif cycle < 8:
                return 120
            else:
                return 400

        return self.base_load
