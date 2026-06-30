from fastapi import APIRouter

router = APIRouter(tags=["Health"])


@router.get("/health")
async def health_check():
    """
    Simple health check endpoint to verify the service is running
    """
    return {
        "status": "ok",
        "message": "Portfolio is healthy"
    }
