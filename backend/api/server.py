import time
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, WebSocket, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from models import SimulationConfig
from simulation.engine import SimulationEngine

logger = logging.getLogger("vcc.api")
engine = SimulationEngine()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting VCC Simulation API")
    await engine.start()
    yield
    logger.info("Shutting down VCC Simulation API")
    await engine.stop()


app = FastAPI(lifespan=lifespan, title="VCC Simulation API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    elapsed = time.time() - start
    logger.info(
        f"{request.method} {request.url.path} -> {response.status_code} ({elapsed:.3f}s)"
    )
    return response


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "simulation_running": engine.state.running,
        "uptime_ticks": len(engine.state.load_history),
        "version": "1.0.0",
    }


@app.get("/state")
async def get_state():
    return engine.state.model_dump(mode="json")


@app.post("/start")
async def start_simulation():
    if engine.state.running:
        return {"status": "already_running"}
    await engine.start()
    return {"status": "started"}


@app.post("/stop")
async def stop_simulation():
    if not engine.state.running:
        return {"status": "already_stopped"}
    await engine.stop()
    return {"status": "stopped"}


@app.get("/config")
async def get_config():
    return engine.config.model_dump(mode="json")


@app.post("/config")
async def update_config(config: SimulationConfig):
    engine.update_config(config)
    logger.info("Config updated", extra={"pattern": config.pattern.value})
    return {"status": "updated"}


@app.get("/metrics")
async def get_metrics():
    s = engine.state
    return {
        "system": s.system_metrics.model_dump(mode="json"),
        "scaling": {
            "active_servers": s.active_count,
            "pending_servers": s.pending_count,
            "warm_servers": s.warm_count,
            "total_actions": s.cold_start.total_cold_starts,
            "last_decision": s.scaling_decision.action,
        },
        "cold_start": s.cold_start.model_dump(mode="json"),
        "prediction": {
            "current": s.current_users,
            "forecast": s.prediction,
            "confidence": s.prediction_confidence.model_dump(mode="json"),
        },
        "security": {
            "thrash": s.thrash.model_dump(mode="json"),
            "edos": s.edos.model_dump(mode="json"),
        },
    }


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    logger.info("WebSocket client connected")

    async def send_state(state):
        try:
            await websocket.send_json(state.model_dump(mode="json"))
        except Exception:
            engine.remove_listener(send_state)

    engine.add_listener(send_state)

    try:
        while True:
            await websocket.receive_text()
    except Exception:
        pass
    finally:
        engine.remove_listener(send_state)
        logger.info("WebSocket client disconnected")
