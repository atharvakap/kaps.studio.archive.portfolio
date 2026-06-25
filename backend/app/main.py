from fastapi import FastAPI
from app.lifespan import lifespan

app = FastAPI(
    title="kaps.studio.archive Portfolio Backend",
    description="Backend service powering portfolio",
    version="0.1.0",
    lifespan=lifespan
)