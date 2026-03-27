import dayjs, { Dayjs } from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import utc from 'dayjs/plugin/utc'

dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(isSameOrBefore)

/**
 * Normalize date format tokens to Dayjs-compatible format.
 *
 * Supported aliases:
 * - yyyy -> YYYY
 * - dd   -> DD
 * - mm   -> MM
 *
 * @param format - Input date format string
 * @returns Normalized Dayjs format string
 */
const normalizeFormat = (format: string): string =>
  format.replace(/yyyy/g, 'YYYY').replace(/dd/g, 'DD').replace(/mm/g, 'MM')

/**
 * Parse a date string into a Dayjs object using strict format validation.
 *
 * @param dateStr - Date string to parse (e.g. "31/12/2025")
 * @param format - Expected input format (default: "DD/MM/YYYY")
 * @returns Dayjs instance if valid, otherwise null
 */
export const parseStringToDate = (dateStr: string, format: string = 'DD/MM/YYYY'): Dayjs | null => {
  if (!dateStr) return null

  const dayjsFormat = normalizeFormat(format)
  const d = dayjs(dateStr, dayjsFormat, true) // strict parsing

  return d.isValid() ? d : null
}

/**
 * Format a Dayjs date for UI display.
 *
 * @param date - Dayjs instance (or null/undefined)
 * @param format - Display format (default: "DD/MM/YYYY")
 * @returns Formatted date string for UI, or empty string if date is null
 */
export const formatDisplayDate = (date?: Dayjs | null, format: string = 'DD/MM/YYYY'): string => {
  return date ? date.format(format) : ''
}

export const formatUTCDate = (date: Dayjs): string => {
  return date.utc().format('YYYY-MM-DD')
}
export const generateYears = (range: number = 100, maxDate: Dayjs = dayjs()): number[] => {
  const currentYear = maxDate.year()

  return Array.from({ length: range }, (_, i) => currentYear - i).sort((a, b) => a - b)
}

export const generateMonths = (year: number, maxDate: Dayjs = dayjs()): { value: number; label: string }[] => {
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i,
    label: `Tháng ${i + 1}`
  }))

  const isCurrentYear = year === maxDate.year()

  if (!isCurrentYear) return months

  return months.slice(0, maxDate.month() + 1)
}
export const generateDays = (
  year: number,
  month: number, // 1-12
  maxDate: Dayjs = dayjs()
): number[] => {
  const daysInMonth = new Date(year, month, 0).getDate()

  const allDays = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  const isCurrentYear = year === maxDate.year()
  const isCurrentMonth = month === maxDate.month() + 1

  if (isCurrentYear && isCurrentMonth) {
    return allDays.slice(0, maxDate.date())
  }

  return allDays
}

export const getTodayDateRange = (): { fromDate: string; toDate: string } => {
  const now = dayjs()

  const fromDate = now.startOf('day').utc()
  const toDate = now.endOf('day').utc()
  // const toDate = now.add(1, 'day').startOf('day').utc()
  return {
    fromDate: fromDate.toISOString(),
    toDate: toDate.toISOString()
  }
}

/**
 * Convert a Date object to start-of-day UTC ISO string (00:00:00.000Z).
 * Used for fromDate.
 */
export const toISOString = (date: Date): string => {
  return dayjs(date).startOf('day').utc().toISOString()
}

/**
 * Convert a Date object to end-of-day UTC ISO string (23:59:59.999Z).
 * Used for toDate to ensure the full last day is included.
 *
 * Example: user picks 8/3/2026 in Vietnam (UTC+7)
 *   → Date object is 2026-03-08T00:00:00.000+07:00
 *   → End of day in UTC = 2026-03-08T16:59:59.999Z
 *   → In Vietnam time that is 2026-03-08T23:59:59
 */
export const toEndOfDayISOString = (date: Date): string => {
  return dayjs(date).endOf('day').utc().toISOString()
}

/**
 * Check if a date string is today (local time).
 *
 * @param dateString - ISO date string
 * @returns true if the date is today
 */
export const isToday = (dateString: string | null): boolean => {
  if (!dateString) return false
  return dayjs(dateString).isSame(dayjs(), 'day')
}

/**
 * Check if a date string is NOT in the future (local timezone).
 *
 * @param dateStr - Date string (e.g. "24/03/2026")
 * @param format - Format (default: "DD/MM/YYYY")
 * @returns true if valid (<= today), false if future/invalid
 */
export const isNotFutureDate = (dateStr: string, format: string = 'DD/MM/YYYY'): boolean => {
  const input = parseStringToDate(dateStr, format)
  if (!input) return false

  const today = dayjs()

  return input.isSame(today, 'day') || input.isBefore(today, 'day')
}
