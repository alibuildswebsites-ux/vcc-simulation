import os
import sys
import logging


def setup_logging():
    level = os.environ.get("VCC_LOG_LEVEL", "INFO").upper()
    log_format = (
        "%(asctime)s [%(levelname)-7s] %(name)-15s %(message)s"
    )
    logging.basicConfig(
        level=getattr(logging, level, logging.INFO),
        format=log_format,
        datefmt="%Y-%m-%d %H:%M:%S",
        stream=sys.stdout,
    )
    logging.getLogger("vcc").setLevel(level)
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)


if __name__ == "__main__":
    setup_logging()
    import uvicorn

    host = os.environ.get("VCC_HOST", "0.0.0.0")
    port = int(os.environ.get("VCC_PORT", "8001"))  # Changed to 8001
    reload_enabled = os.environ.get("VCC_RELOAD", "true").lower() == "true"

    uvicorn.run(
        "api.server:app",
        host=host,
        port=port,
        reload=reload_enabled,
        log_level="info",
    )