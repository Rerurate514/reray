import { describe, expect, it } from 'vitest'
import { normalizeTagNames } from '../../../../app/domain/tag/services/normalizeTagNames'

describe('normalizeTagNames', () => {
  it('splits a comma separated string and normalizes each tag', () => {
    expect(normalizeTagNames(' #React, TypeScript ,react ')).toEqual(['react', 'typescript'])
  })

  it('accepts an array and removes duplicates', () => {
    expect(normalizeTagNames(['alpha', 'Alpha', ' beta '])).toEqual(['alpha', 'beta'])
  })

  it('returns an empty list for blank input', () => {
    expect(normalizeTagNames(undefined)).toEqual([])
    expect(normalizeTagNames('  ,  ')).toEqual([])
  })

  it('keeps at most 8 tags', () => {
    const tags = Array.from({ length: 10 }, (_, index) => `tag-${index}`)
    expect(normalizeTagNames(tags)).toHaveLength(8)
  })

  it('rejects a tag longer than 24 characters', () => {
    expect(() => normalizeTagNames('a'.repeat(25))).toThrow('Tag must be 24 characters or less')
  })
})
