import dayjs, { Dayjs } from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

/**
 * Parse date string to Dayjs object using strict format validation
 *
 * @param dateStr - Date string to parse (e.g. "31/12/2025")
 * @param format - Date format pattern (default: DD/MM/YYYY)
 *
 * Supported tokens:
 * - YYYY / yyyy : four-digit year
 * - MM / mm     : two-digit month
 * - DD / dd     : two-digit day
 *
 * @returns Dayjs object if valid, otherwise null
 */
export const parseStringToDate = (dateStr: string, format: string = 'DD/MM/YYYY'): Dayjs | null => {
  if (!dateStr) return null

  const dayjsFormat = format.replace(/yyyy/g, 'YYYY').replace(/dd/g, 'DD').replace(/mm/g, 'MM').replace(/-/g, '/')

  const d = dayjs(dateStr, dayjsFormat, true)
  if (!d.isValid()) return null

  return d
}

/**
 * Format a Dayjs date for UI display
 *
 * @param date - Dayjs instance
 * @param format - Output format (default: DD/MM/YYYY)
 * @returns Formatted date string
 */
export const formatDisplayDate = (date: Dayjs, format: string = 'DD/MM/YYYY'): string => {
  return date.format(format)
}

/**
 * Convert Dayjs date to ISO 8601 string (UTC-based)
 *
 * @param date - Dayjs instance
 * @returns ISO date string (e.g. 2025-01-01T00:00:00.000Z)
 */
export const formatISODate = (date: Dayjs): string => {
  return date.toISOString()
}

/**
 * Generate list of valid days for a specific month & year
 *
 * @param year - Full year (e.g. 2025)
 * @param month - Month number (1 - 12)
 * @returns Array of day numbers (e.g. [1, 2, 3, ..., 31])
 */
export const generateDays = (year: number, month: number): number[] => {
  const daysInMonth = new Date(year, month, 0).getDate()
  return Array.from({ length: daysInMonth }, (_, i) => i + 1)
}

/**
 * Generate list of years counting backwards from current UTC year
 *
 * @param range - Number of years to generate (default: 100)
 * @returns Array of years (e.g. [2025, 2024, 2023, ...])
 */
export const generateYears = (range: number = 100): number[] => {
  const currentYear = new Date().getUTCFullYear()
  return Array.from({ length: range }, (_, i) => currentYear - i)
}

/**
 * Generate list of months for select / picker components
 *
 * @returns Array of month objects:
 * - value: month index (0 - 11)
 * - label: localized label (e.g. "Tháng 1")
 */
export const generateMonths = (): { value: number; label: string }[] => {
  return Array.from({ length: 12 }, (_, i) => ({
    value: i,
    label: `Tháng ${i + 1}`
  }))
}
