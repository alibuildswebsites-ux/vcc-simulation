import random
import logging
from models import ColdStartMetrics

logger = logging.getLogger("vcc.cold_start")


class ColdStartManager:
    def __init__(self, base_delay: int = 5, warm_pool_target: int = 2,
                 min_warm_pool: int = 1, max_warm_pool: int = 10):
        self.base_delay = base_delay
        self.warm_pool_target = warm_pool_target
        self.min_warm_pool = min_warm_pool
        self.max_warm_pool = max_warm_pool
        self.ewma_delay = float(base_delay)
        self.alpha = 0.3
        self.pending = []
        self.warm_pool = []
        self.active_servers = []
        self.total_cold_starts = 0
        self.avg_delay = 0.0
        self.current_horizon = max(3, base_delay * 2)
        self._id_counter = 0

        for _ in range(warm_pool_target):
            self._id_counter += 1
            self.warm_pool.append(f"srv-{self._id_counter}")

    def get_adaptive_horizon(self) -> int:
        self.current_horizon = max(3, int(self.ewma_delay * 1.5) + 2)
        return self.current_horizon

    def adjust_warm_pool_target(self, prediction_error: float):
        if prediction_error > 0.25:
            new_target = min(self.max_warm_pool, self.warm_pool_target + 1)
            if new_target != self.warm_pool_target:
                self.warm_pool_target = new_target
                logger.info("Increased warm pool due to prediction uncertainty",
                            extra={"new_target": new_target, "error": round(prediction_error, 3)})
        elif prediction_error < 0.08 and self.warm_pool_target > self.min_warm_pool:
            new_target = max(self.min_warm_pool, self.warm_pool_target - 1)
            if new_target != self.warm_pool_target:
                self.warm_pool_target = new_target
                logger.info("Decreased warm pool - predictions stable",
                            extra={"new_target": new_target, "error": round(prediction_error, 3)})

    def _gen_id(self):
        self._id_counter += 1
        return f"srv-{self._id_counter}"

    def scale_up(self) -> bool:
        if self.warm_pool:
            sid = self.warm_pool.pop(0)
            self.active_servers.append(sid)
            return False
        else:
            sid = self._gen_id()
            delay_noise = random.gauss(0, 1)
            actual_delay = max(1, int(round(self.ewma_delay + delay_noise)))
            self.pending.append({
                "id": sid,
                "remaining": actual_delay,
                "total_delay": actual_delay,
            })
            self.total_cold_starts += 1
            return True

    def scale_down(self, count: int):
        actual = min(count, len(self.active_servers))
        for _ in range(actual):
            self.active_servers.pop(0)

    def tick(self):
        for s in self.pending:
            s["remaining"] -= 1

        ready = []
        still_pending = []
        for s in self.pending:
            if s["remaining"] <= 0:
                ready.append(s["id"])
                observed = s["total_delay"]
                self.ewma_delay = self.alpha * observed + (1 - self.alpha) * self.ewma_delay
                if self.total_cold_starts > 0:
                    self.avg_delay = (
                        (self.avg_delay * (self.total_cold_starts - 1) + observed)
                        / self.total_cold_starts
                    )
            else:
                still_pending.append(s)
        self.pending = still_pending

        for sid in ready:
            if len(self.warm_pool) < self.warm_pool_target:
                self.warm_pool.append(sid)
            else:
                self.active_servers.append(sid)

        total_available = len(self.pending) + len(self.warm_pool)
        while total_available < self.warm_pool_target:
            self._id_counter += 1
            self.warm_pool.append(f"srv-{self._id_counter}")
            total_available += 1

    def get_metrics(self) -> ColdStartMetrics:
        return ColdStartMetrics(
            total_cold_starts=self.total_cold_starts,
            avg_delay_ticks=round(self.avg_delay, 2),
            current_ewma_delay=round(self.ewma_delay, 2),
            warm_pool_size=len(self.warm_pool),
            adaptive_horizon=self.current_horizon,
        )
