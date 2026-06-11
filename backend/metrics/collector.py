import random
import math
from models import SystemMetrics


class MetricsCollector:
    def __init__(self):
        self.cpu = 0.0
        self.latency_ms = 0.0
        self.queue_depth = 0

    def update(self, current_users: int, active_servers: int, users_per_server: int):
        if active_servers == 0:
            self.cpu = 100.0
            self.latency_ms = 10000.0
            self.queue_depth = current_users * 10
            return

        total_capacity = active_servers * users_per_server
        utilization = current_users / max(1, total_capacity)

        self.cpu = min(100.0, utilization * 100 + random.gauss(0, 3))
        self.cpu = max(1.0, self.cpu)

        load_ratio = current_users / (active_servers * users_per_server * 0.8)
        if load_ratio > 1:
            self.latency_ms = 200 + 5000 * (load_ratio - 1) ** 2
        else:
            self.latency_ms = 20 + 180 * load_ratio
        self.latency_ms += random.gauss(0, 10)
        self.latency_ms = max(5.0, self.latency_ms)

        if utilization > 0.75:
            self.queue_depth += int((utilization - 0.75) * current_users * 0.3) + 1
        else:
            self.queue_depth = int(self.queue_depth * 0.92)

        cap = max(1000, current_users * 3)
        self.queue_depth = max(0, min(self.queue_depth, cap))

    def get_state(self) -> SystemMetrics:
        return SystemMetrics(
            cpu_percent=round(self.cpu, 1),
            latency_ms=round(self.latency_ms, 1),
            queue_depth=self.queue_depth,
        )
