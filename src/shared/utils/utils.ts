import { ApiErrorResponse } from '../types/api.type'

export const isApiError = (error: unknown): error is ApiErrorResponse =>
  typeof error === 'object' && error !== null && typeof (error as any).code === 'number' && (error as any).code !== 200

export const isUnauthorizedError = (error: unknown): error is ApiErrorResponse =>
  isApiError(error) && (error as ApiErrorResponse).code === 401

export const isExpiredTokenError = (error: unknown): error is ApiErrorResponse =>
  isUnauthorizedError(error) && (error as ApiErrorResponse).data.E0043 !== undefined
