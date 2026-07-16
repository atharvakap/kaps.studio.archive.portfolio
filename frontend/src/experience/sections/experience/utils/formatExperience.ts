import type { DatabaseExperience, Experience } from '../types'

export const formatExperienceData = (
  rawData: DatabaseExperience[]
): Experience[] => {
  return (
    rawData
      // Sort ascending by display_order as defined in your DB
      .sort((a, b) => a.display_order - b.display_order)
      .map((exp) => {
        const startDate = new Date(exp.start_date)
        const endDate = exp.end_date ? new Date(exp.end_date) : new Date()

        // Calculate duration
        const diffMonths =
          (endDate.getFullYear() - startDate.getFullYear()) * 12 +
          (endDate.getMonth() - startDate.getMonth()) +
          1

        const years = Math.floor(diffMonths / 12)
        const months = diffMonths % 12

        const durationParts = []
        if (years > 0) durationParts.push(`${years} yr${years > 1 ? 's' : ''}`)
        if (months > 0 || years === 0)
          durationParts.push(`${months} mo${months > 1 ? 's' : ''}`)

        const formatOpts: Intl.DateTimeFormatOptions = {
          month: 'short',
          year: 'numeric',
        }

        return {
          ...exp,
          isCurrent: exp.end_date === null,
          formattedStartDate: startDate.toLocaleDateString('en-US', formatOpts),
          formattedEndDate: exp.end_date
            ? endDate.toLocaleDateString('en-US', formatOpts)
            : 'Present',
          durationLabel: durationParts.join(' '),
        }
      })
  )
}
