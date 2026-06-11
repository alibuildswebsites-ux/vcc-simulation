import numpy as np
from ml.base import BasePredictor


class LSTMPredictor(BasePredictor):
    def __init__(self, sequence_length=10, epochs=5):
        self.sequence_length = sequence_length
        self.epochs = epochs
        self.model = None
        self._available = None

    def _check_available(self):
        if self._available is None:
            try:
                import tensorflow as tf
                self._available = True
            except ImportError:
                self._available = False
        return self._available

    def _build_model(self):
        import tensorflow as tf
        from tensorflow import keras
        model = keras.Sequential([
            keras.layers.LSTM(32, input_shape=(self.sequence_length, 1)),
            keras.layers.Dropout(0.2),
            keras.layers.Dense(16, activation='relu'),
            keras.layers.Dense(1)
        ])
        model.compile(optimizer='adam', loss='mse')
        return model

    def train(self, history: list[float]):
        if not self._check_available():
            return
        if len(history) < self.sequence_length + 1:
            return

        from tensorflow import keras

        if self.model is None:
            self.model = self._build_model()
            if self.model is None:
                return

        X, y = [], []
        for i in range(len(history) - self.sequence_length):
            X.append(history[i:i + self.sequence_length])
            y.append(history[i + self.sequence_length])

        X = np.array(X).reshape(-1, self.sequence_length, 1)
        y = np.array(y)

        self.model.fit(X, y, epochs=self.epochs, verbose=0, batch_size=16, callbacks=[
            keras.callbacks.EarlyStopping(monitor='loss', patience=2, restore_best_weights=True)
        ])

    def predict(self, history: list[float], horizon: int) -> list[float]:
        if not self._check_available() or self.model is None or len(history) < self.sequence_length:
            return [float(history[-1]) if history else 0.0] * horizon

        predictions = []
        current = list(history[-self.sequence_length:])

        for _ in range(horizon):
            X = np.array(current).reshape(1, self.sequence_length, 1)
            pred = float(self.model.predict(X, verbose=0)[0][0])
            predictions.append(max(0.0, pred))
            current.pop(0)
            current.append(pred)

        return predictions
