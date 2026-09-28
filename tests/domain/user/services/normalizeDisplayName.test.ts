import { describe, expect, it } from 'vitest'
import { normalizeDisplayName } from '../../../../app/domain/user/services/normalizeDisplayName'

describe('normalizeDisplayName', () => {
  it('trims and collapses internal whitespace', () => {
    expect(normalizeDisplayName('  Alice   Smith  ')).toBe('Alice Smith')
  })

  it('rejects a blank display name', () => {
    expect(() => normalizeDisplayName('   ')).toThrow('Display name is required')
  })

  it('truncates to 40 characters', () => {
    expect(normalizeDisplayName('a'.repeat(50))).toBe('a'.repeat(40))
  })
})
