import { describe, expect, it } from 'vitest'
import { normalizeArticleUrl } from '../../../../app/domain/article/services/normalizeArticleUrl'

describe('normalizeArticleUrl', () => {
  it('returns a normalized https url', () => {
    expect(normalizeArticleUrl('https://example.com/posts/1')).toBe('https://example.com/posts/1')
  })

  it('trims surrounding whitespace', () => {
    expect(normalizeArticleUrl('  https://example.com/  ')).toBe('https://example.com/')
  })

  it('rejects a value that is not a url', () => {
    expect(() => normalizeArticleUrl('not a url')).toThrow('Article URL must be a valid http or https URL')
  })

  it('rejects a non http protocol', () => {
    expect(() => normalizeArticleUrl('ftp://example.com/file')).toThrow('Article URL must start with http or https')
  })
})
