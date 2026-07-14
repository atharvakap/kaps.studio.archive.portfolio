import { useQuery } from '@tanstack/react-query'
import { fetchSkills } from '@/services/skills'
import type { Skill, GroupedCategory } from '../types'

export const useSkills = () => {
  return useQuery<GroupedCategory[], Error>({
    queryKey: ['skills'],
    queryFn: async () => {
      // 1. Fetch the raw flat array from the backend
      const rawSkills = await fetchSkills()

      // 2. Group the skills by their category name
      const groupedData = rawSkills.reduce(
        (acc: Record<string, Skill[]>, skill) => {
          if (!acc[skill.category]) {
            acc[skill.category] = []
          }
          acc[skill.category].push(skill)
          return acc
        },
        {}
      )

      // 3. Transform the object into an array, count the skills, and sort alphabetically
      const formattedData: GroupedCategory[] = Object.keys(groupedData)
        .map((categoryName) => ({
          category: categoryName,
          skills: groupedData[categoryName],
          count: groupedData[categoryName].length,
        }))
        .sort((a, b) => a.category.localeCompare(b.category))

      return formattedData
    },
    // Cache the grouped data for 5 minutes to prevent unnecessary recalculations
    staleTime: 1000 * 60 * 5,
  })
}
