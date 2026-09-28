import { UserFacingError } from '../../domain/shared/errors/userFacingError'
import type { UserFacingErrorCode } from '../../domain/shared/errors/userFacingError'

type ErrorStatus = 400 | 401 | 403 | 404 | 500

const statusByCode: Record<UserFacingErrorCode, ErrorStatus> = {
  validation: 400,
  conflict: 400,
  authenticationRequired: 401,
  forbidden: 403,
  notFound: 404,
}

export function presentError(error: unknown, fallbackMessage: string): { status: ErrorStatus; message: string } {
  if (error instanceof UserFacingError) {
    return { status: statusByCode[error.code], message: error.message }
  }

  console.error(error)
  return { status: 500, message: fallbackMessage }
}
