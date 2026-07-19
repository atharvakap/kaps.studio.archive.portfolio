import { useQuery } from '@tanstack/react-query'
import { fetchProjects } from '../../../../services/projectService'
import type { Project } from '../types'

export const useProjects = () => {
  return useQuery<Project[], Error>({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
    retry: 2,
  })
}
