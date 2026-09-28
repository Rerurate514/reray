import { describe, expect, it } from 'vitest'
import { UserFacingError } from '../../../../app/domain/shared/errors/userFacingError'
import { normalizeCalendarTitle } from '../../../../app/domain/calendar/services/normalizeCalendarTitle'

describe('normalizeCalendarTitle', () => {
  it('trims surrounding whitespace', () => {
    expect(normalizeCalendarTitle('  Relay 2026  ')).toBe('Relay 2026')
  })

  it('accepts a title of exactly 120 characters', () => {
    expect(normalizeCalendarTitle('a'.repeat(120))).toBe('a'.repeat(120))
  })

  it('rejects a blank title as a validation error', () => {
    expect(() => normalizeCalendarTitle('   ')).toThrow(UserFacingError)
    expect(() => normalizeCalendarTitle('   ')).toThrow('Title is required')
  })

  it('rejects a title longer than 120 characters', () => {
    expect(() => normalizeCalendarTitle('a'.repeat(121))).toThrow('Title must be 120 characters or fewer')
  })
})
