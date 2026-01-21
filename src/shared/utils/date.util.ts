import dayjs, { Dayjs } from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import utc from 'dayjs/plugin/utc'

dayjs.extend(customParseFormat)
dayjs.extend(utc)

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
 * ⚠️ This function parses a DATE-ONLY value (no timezone applied).
 * Use this for birthday, form dates, etc.
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

/**
 * Convert a Dayjs date to an ISO 8601 DATE-ONLY string computed in UTC.
 *
 * Result format:
 *   YYYY-MM-DD
 *
 * Examples:
 * - 2025-01-01
 *
 * ⚠️ Use this ONLY when the business rule requires UTC-based date calculation.
 * ❌ Do NOT use for birthday or user-selected calendar dates.
 *
 * @param date - Dayjs instance
 * @returns ISO 8601 date-only string (UTC-based)
 */
export const formatUTCDate = (date: Dayjs): string => {
  return date.utc().format('YYYY-MM-DD')
}

/**
 * Generate a list of valid day numbers for a given month and year.
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
 * Generate a list of years counting backwards from the current UTC year.
 *
 * @param range - Number of years to generate (default: 100)
 * @returns Array of years (e.g. [2025, 2024, 2023, ...])
 */
export const generateYears = (range: number = 100): number[] => {
  const currentYear = new Date().getUTCFullYear()
  return Array.from({ length: range }, (_, i) => currentYear - i)
}

/**
 * Generate a list of months for select / picker components.
 *
 * Note:
 * - value is ZERO-BASED month index (0 = January, 11 = December)
 *
 * @returns Array of month objects
 */
export const generateMonths = (): { value: number; label: string }[] => {
  return Array.from({ length: 12 }, (_, i) => ({
    value: i,
    label: `Tháng ${i + 1}`
  }))
}
