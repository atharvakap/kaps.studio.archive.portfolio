import type { Experience } from '../types'

export const calculateExperienceStats = (experiences?: Experience[]) => {
  if (!experiences || experiences.length === 0) {
    return { totalYears: 0, totalCompanies: 0 }
  }

  // Count unique companies
  const companies = new Set(experiences.map((exp) => exp.company))

  // Find earliest start date and latest end date (or now)
  const startDates = experiences.map((exp) =>
    new Date(exp.start_date).getTime()
  )
  const earliestStart = Math.min(...startDates)

  const endDates = experiences.map((exp) =>
    exp.end_date ? new Date(exp.end_date).getTime() : Date.now()
  )
  const latestEnd = Math.max(...endDates)

  // Calculate total years (rounded to 1 decimal place)
  const totalMs = latestEnd - earliestStart
  const totalYears = (totalMs / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1)

  return {
    totalYears: parseFloat(totalYears),
    totalCompanies: companies.size,
  }
}
