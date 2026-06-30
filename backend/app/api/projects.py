from typing import List, Optional

from fastapi import APIRouter, Depends, Path, Query

from app.api.deps import get_project_service
from app.schemas.project import ProjectRead
from app.services.project_service import ProjectService

router = APIRouter(prefix="/projects", tags=["Projects"])


@router.get("", response_model=List[ProjectRead])
async def get_projects(
    # Validate the query parameter (must be a boolean if provided)
    featured: Optional[bool] = Query(None, description="Filter by featured status"),
    service: ProjectService = Depends(get_project_service),
):
    if featured:
        return await service.get_featured_projects()
    return await service.get_projects()


@router.get("/{slug}", response_model=ProjectRead)
async def get_project(
    # Validate the path parameter (must be lowercase letters, numbers, or hyphens)
    slug: str = Path(..., min_length=3, max_length=100, pattern=r"^[a-z0-9-]+$"),
    service: ProjectService = Depends(get_project_service),
):
    return await service.get_project_by_slug(slug)
