import logging
from collections import deque
from models import ScalingDecision, EDOSState

logger = logging.getLogger("vcc.edos")


class EDOSDetector:
    def __init__(self, window_size: int = 10, frequency_threshold: float = 0.6):
        self.window_size = window_size
        self.frequency_threshold = frequency_threshold
        self.history: deque = deque(maxlen=window_size)
        self.alert_active = False

    def record_decision(self, decision: ScalingDecision):
        self.history.append(decision.action != "none")

    def check(self) -> EDOSState:
        if len(self.history) < self.window_size:
            return EDOSState(alert=False, confidence=0.0)

        scaling_count = sum(1 for x in self.history if x)
        frequency = scaling_count / len(self.history)
        alert = frequency > self.frequency_threshold

        if alert and not self.alert_active:
            logger.warning(
                "EDoS signature detected - possible economic attack",
                extra={
                    "frequency": round(frequency, 3),
                    "scaling_actions": scaling_count,
                    "window": len(self.history),
                },
            )

        self.alert_active = alert
        return EDOSState(
            alert=alert,
            scaling_frequency=round(frequency, 4),
            confidence=min(1.0, frequency / self.frequency_threshold),
        )
