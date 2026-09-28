export type UserFacingErrorCode = 'authenticationRequired' | 'forbidden' | 'validation' | 'notFound' | 'conflict'

export class UserFacingError extends Error {
  readonly code: UserFacingErrorCode

  constructor(code: UserFacingErrorCode, message: string) {
    super(message)
    this.name = 'UserFacingError'
    this.code = code
  }
}
