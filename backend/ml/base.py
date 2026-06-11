from abc import ABC, abstractmethod


class BasePredictor(ABC):
    @abstractmethod
    def predict(self, history: list[float], horizon: int) -> list[float]:
        pass

    @abstractmethod
    def train(self, history: list[float]):
        pass
