import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockConfig = {
  logTemplate: 'console.log(\'{selected}\', {selected})',
}

vi.mock('../src/config', () => ({
  config: mockConfig,
}))

const { buildLogStatement } = await import('../src/log')

describe('buildLogStatement', () => {
  beforeEach(() => {
    mockConfig.logTemplate = 'console.log(\'{selected}\', {selected})'
  })

  it('returns empty console.log for empty text', () => {
    expect(buildLogStatement('')).toBe('console.log()')
  })

  it('replaces {selected} with variable name', () => {
    expect(buildLogStatement('myVar')).toBe('console.log(\'myVar\', myVar)')
  })

  it('handles dotted property access', () => {
    expect(buildLogStatement('foo.bar')).toBe('console.log(\'foo.bar\', foo.bar)')
  })

  it('replaces {line} with line number', () => {
    mockConfig.logTemplate = 'console.log(\'{line}:\', {selected})'
    expect(buildLogStatement('x', 42)).toBe('console.log(\'42:\', x)')
  })

  it('replaces {line} with empty string when lineNumber is undefined', () => {
    mockConfig.logTemplate = 'console.log(\'{line}:\', {selected})'
    expect(buildLogStatement('x')).toBe('console.log(\'\:\', x)')
  })

  it('replaces all occurrences of {selected}', () => {
    mockConfig.logTemplate = 'console.log(\'{selected}\', \'{selected}\')'
    expect(buildLogStatement('x')).toBe('console.log(\'x\', \'x\')')
  })

  it('replaces all occurrences of {line}', () => {
    mockConfig.logTemplate = '// line {line} and {line}'
    expect(buildLogStatement('x', 10)).toBe('// line 10 and 10')
  })

  it('works with custom template', () => {
    mockConfig.logTemplate = 'console.debug({selected})'
    expect(buildLogStatement('myVar')).toBe('console.debug(myVar)')
  })

  it('treats lineNumber=0 as valid (not empty string)', () => {
    mockConfig.logTemplate = '\'L{line}:\', {selected}'
    expect(buildLogStatement('x', 0)).toBe('\'L0:\', x')
  })
})
