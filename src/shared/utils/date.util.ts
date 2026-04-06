import dayjs, { Dayjs } from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'

dayjs.extend(customParseFormat)
dayjs.extend(isSameOrBefore)

const normalizeFormat = (format: string): string => format.replace(/yyyy/g, 'YYYY').replace(/dd/g, 'DD')

export const parseDate = (value?: string | Date | null, format = 'YYYY-MM-DD'): Dayjs | null => {
  if (!value) return null

  const d = value instanceof Date ? dayjs(value) : dayjs(value, normalizeFormat(format), true)
  return d.isValid() ? d : null
}

export const formatDate = (
  value?: string | Date | Dayjs | null,
  outputFormat = 'DD/MM/YYYY',
  inputFormat = 'YYYY-MM-DD'
): string => {
  if (!value) return ''

  const d = dayjs.isDayjs(value)
    ? value
    : value instanceof Date
      ? dayjs(value)
      : dayjs(value, normalizeFormat(inputFormat), true)

  return d.isValid() ? d.format(outputFormat) : ''
}

export const toNativeDate = (value?: string | Date | null): Date => {
  if (!value) return new Date()
  const d = dayjs(value)
  return d.isValid() ? d.toDate() : new Date()
}

export const toDateString = (value?: Date | null): string | null => {
  if (!value) return null
  return dayjs(value).format('YYYY-MM-DD')
}

export const toStartOfDayString = (value?: Date | null): string | null => {
  if (!value) return null
  return dayjs(value).startOf('day').format('YYYY-MM-DDTHH:mm:ss')
}

export const toEndOfDayString = (value?: Date | null): string | null => {
  if (!value) return null
  return dayjs(value).endOf('day').format('YYYY-MM-DDTHH:mm:ss')
}

export const getTodayDateRange = (): { fromDate: string; toDate: string } => {
  const today = dayjs().format('YYYY-MM-DD')

  return {
    fromDate: today,
    toDate: today
  }
}

export const isToday = (value?: string | Date | null, format = 'YYYY-MM-DD'): boolean => {
  const d = parseDate(value, format)
  return d ? d.isSame(dayjs(), 'day') : false
}

export const isNotFutureDate = (dateStr: string, format = 'YYYY/MM/DD'): boolean => {
  const input = parseDate(dateStr, format)
  if (!input) return false

  const today = dayjs()
  return input.isSame(today, 'day') || input.isBefore(today, 'day')
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

  return year === maxDate.year() ? months.slice(0, maxDate.month() + 1) : months
}

export const generateDays = (year: number, month: number, maxDate: Dayjs = dayjs()): number[] => {
  const daysInMonth = new Date(year, month, 0).getDate()
  const allDays = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  if (year === maxDate.year() && month === maxDate.month() + 1) {
    return allDays.slice(0, maxDate.date())
  }

  return allDays
}
// import dayjs, { Dayjs } from 'dayjs'
// import customParseFormat from 'dayjs/plugin/customParseFormat'
// import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
// import utc from 'dayjs/plugin/utc'

// dayjs.extend(customParseFormat)
// dayjs.extend(utc)
// dayjs.extend(isSameOrBefore)

// const normalizeFormat = (format: string): string =>
//   format.replace(/yyyy/g, 'YYYY').replace(/dd/g, 'DD').replace(/mm/g, 'MM')

// export const parseStringToDate = (dateStr: string, format: string = 'DD/MM/YYYY'): Dayjs | null => {
//   if (!dateStr) return null

//   const dayjsFormat = normalizeFormat(format)
//   const d = dayjs(dateStr, dayjsFormat, true) // strict parsing

//   return d.isValid() ? d : null
// }

// export const formatDisplayDate = (date?: Dayjs | null, format: string = 'DD/MM/YYYY'): string => {
//   return date ? date.format(format) : ''
// }

// export const formatUTCDate = (date: Dayjs): string => {
//   return date.utc().format('YYYY-MM-DD')
// }
// export const generateYears = (range: number = 100, maxDate: Dayjs = dayjs()): number[] => {
//   const currentYear = maxDate.year()

//   return Array.from({ length: range }, (_, i) => currentYear - i).sort((a, b) => a - b)
// }

// export const generateMonths = (year: number, maxDate: Dayjs = dayjs()): { value: number; label: string }[] => {
//   const months = Array.from({ length: 12 }, (_, i) => ({
//     value: i,
//     label: `Tháng ${i + 1}`
//   }))

//   const isCurrentYear = year === maxDate.year()

//   if (!isCurrentYear) return months

//   return months.slice(0, maxDate.month() + 1)
// }
// export const generateDays = (
//   year: number,
//   month: number, // 1-12
//   maxDate: Dayjs = dayjs()
// ): number[] => {
//   const daysInMonth = new Date(year, month, 0).getDate()

//   const allDays = Array.from({ length: daysInMonth }, (_, i) => i + 1)

//   const isCurrentYear = year === maxDate.year()
//   const isCurrentMonth = month === maxDate.month() + 1

//   if (isCurrentYear && isCurrentMonth) {
//     return allDays.slice(0, maxDate.date())
//   }

//   return allDays
// }

// export const getTodayDateRange = (): { fromDate: string; toDate: string } => {
//   const now = dayjs()

//   const fromDate = now.startOf('day').utc()
//   const toDate = now.endOf('day').utc()
//   // const toDate = now.add(1, 'day').startOf('day').utc()
//   return {
//     fromDate: fromDate.toISOString(),
//     toDate: toDate.toISOString()
//   }
// }

// export const toISOString = (date: Date): string => {
//   return dayjs(date).startOf('day').utc().toISOString()
// }

// export const toEndOfDayISOString = (date: Date): string => {
//   return dayjs(date).endOf('day').utc().toISOString()
// }

// export const isToday = (dateString: string | null): boolean => {
//   if (!dateString) return false
//   return dayjs(dateString).isSame(dayjs(), 'day')
// }

// export const isNotFutureDate = (dateStr: string, format: string = 'DD/MM/YYYY'): boolean => {
//   const input = parseStringToDate(dateStr, format)
//   if (!input) return false

//   const today = dayjs()

//   return input.isSame(today, 'day') || input.isBefore(today, 'day')
// }
