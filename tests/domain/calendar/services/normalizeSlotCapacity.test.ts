import { describe, expect, it } from 'vitest'
import { normalizeSlotCapacity } from '../../../../app/domain/calendar/services/normalizeSlotCapacity'

describe('normalizeSlotCapacity', () => {
  it('accepts a valid number or numeric string', () => {
    expect(normalizeSlotCapacity(5)).toBe(5)
    expect(normalizeSlotCapacity('7')).toBe(7)
  })

  it('falls back to 1 for undefined, non-numeric, and values below 1', () => {
    expect(normalizeSlotCapacity(undefined)).toBe(1)
    expect(normalizeSlotCapacity('abc')).toBe(1)
    expect(normalizeSlotCapacity(0)).toBe(1)
    expect(normalizeSlotCapacity(-3)).toBe(1)
  })

  it('truncates fractions', () => {
    expect(normalizeSlotCapacity(2.9)).toBe(2)
  })

  it('caps the capacity at 99', () => {
    expect(normalizeSlotCapacity(99)).toBe(99)
    expect(normalizeSlotCapacity(100)).toBe(99)
    expect(normalizeSlotCapacity('1000')).toBe(99)
  })
})
