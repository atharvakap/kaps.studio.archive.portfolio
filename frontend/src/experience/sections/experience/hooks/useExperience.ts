import { useQuery } from '@tanstack/react-query'
import { fetchExperiences } from '../../../../services/experience'
import { formatExperienceData } from '../utils/formatExperience'
import type { Experience } from '../types'

export const useExperience = () => {
  return useQuery<Experience[], Error>({
    queryKey: ['experience'],
    queryFn: async () => {
      const rawData = await fetchExperiences()
      return formatExperienceData(rawData)
    },
    staleTime: 1000 * 60 * 5, // Cache the data for 5 minutes
  })
}
