import logging
from collections import deque
from models import ScalingDecision, ThrashState

logger = logging.getLogger("vcc.thrash")


class ThrashDetector:
    def __init__(self, window_size: int = 10, threshold: int = 4):
        self.window_size = window_size
        self.threshold = threshold
        self.history: deque = deque(maxlen=window_size)
        self.is_thrashing = False
        self.stabilization_mode = False
        self.stabilization_remaining = 0

    def record_decision(self, decision: ScalingDecision):
        if decision.action != "none":
            self.history.append(decision.action)
            self._evaluate()

    def _evaluate(self):
        if len(self.history) < 3:
            self.is_thrashing = False
            return

        reversals = 0
        for i in range(1, len(self.history)):
            if self.history[i] != self.history[i - 1]:
                reversals += 1

        self.is_thrashing = reversals >= self.threshold

        if self.is_thrashing and not self.stabilization_mode:
            self.stabilization_mode = True
            self.stabilization_remaining = 20
            logger.warning(
                "Thrash detected - entering stabilization mode",
                extra={"reversals": reversals, "window": len(self.history)},
            )

    def tick(self):
        if self.stabilization_remaining > 0:
            self.stabilization_remaining -= 1
            if self.stabilization_remaining <= 0:
                self.stabilization_mode = False
                logger.info("Stabilization mode ended")

    def get_cooldown_multiplier(self, action: str) -> int:
        if not self.stabilization_mode:
            return 1
        return 3 if action == "scale_down" else 2

    def get_state(self) -> ThrashState:
        reversals = 0
        for i in range(1, len(self.history)):
            if self.history[i] != self.history[i - 1]:
                reversals += 1
        return ThrashState(
            is_thrashing=self.is_thrashing,
            stabilization_mode=self.stabilization_mode,
            reversal_count=reversals,
            window_size=len(self.history),
        )
