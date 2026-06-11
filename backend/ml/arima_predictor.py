import warnings
import numpy as np
from ml.base import BasePredictor


class ARIMAPredictor(BasePredictor):
    def __init__(self, order=(2, 1, 2)):
        self.order = order
        self.model = None

    def train(self, history: list[float]):
        try:
            from statsmodels.tsa.arima.model import ARIMA
            with warnings.catch_warnings():
                warnings.simplefilter("ignore")
                self.model = ARIMA(history, order=self.order).fit()
        except Exception:
            self.model = None

    def predict(self, history: list[float], horizon: int) -> list[float]:
        try:
            self.train(history)
            if self.model is not None:
                forecast = self.model.forecast(horizon)
                return [max(0.0, float(v)) for v in forecast]
        except Exception:
            pass
        return [float(history[-1]) if history else 0.0] * horizon
