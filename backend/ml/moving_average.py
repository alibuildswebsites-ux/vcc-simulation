from ml.base import BasePredictor


class MovingAveragePredictor(BasePredictor):
    def __init__(self, window: int = 10):
        self.window = window

    def train(self, history: list[float]):
        pass

    def predict(self, history: list[float], horizon: int) -> list[float]:
        if len(history) < self.window:
            return [float(history[-1]) if history else 0.0] * horizon
        avg = sum(history[-self.window:]) / self.window
        return [avg] * horizon
