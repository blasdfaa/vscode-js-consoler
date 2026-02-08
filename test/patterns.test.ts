import { describe, expect, it } from 'vitest'
import { extractLoggableIdentifiers } from '../src/patterns'

describe('extractLoggableIdentifiers', () => {
  describe('variable declarations', () => {
    it('const declaration', () => {
      expect(extractLoggableIdentifiers('const x = 5')).toEqual(['x'])
    })

    it('let declaration', () => {
      expect(extractLoggableIdentifiers('let y = 10')).toEqual(['y'])
    })

    it('var declaration', () => {
      expect(extractLoggableIdentifiers('var z = \'hello\'')).toEqual(['z'])
    })

    it('typed declaration (TypeScript)', () => {
      expect(extractLoggableIdentifiers('const x: number = 5')).toEqual(['x'])
    })
  })

  describe('object destructuring', () => {
    it('simple destructuring', () => {
      expect(extractLoggableIdentifiers('const { a, b } = obj')).toEqual(['a', 'b'])
    })

    it('renamed property', () => {
      expect(extractLoggableIdentifiers('const { a: renamed } = obj')).toEqual(['renamed'])
    })

    it('default value', () => {
      expect(extractLoggableIdentifiers('const { a = 5 } = obj')).toEqual(['a'])
    })

    it('mixed rename and normal', () => {
      expect(extractLoggableIdentifiers('let { a, b: c } = obj')).toEqual(['a', 'c'])
    })
  })

  describe('array destructuring', () => {
    it('simple destructuring', () => {
      expect(extractLoggableIdentifiers('const [x, y] = arr')).toEqual(['x', 'y'])
    })

    it('with holes', () => {
      expect(extractLoggableIdentifiers('const [first, , third] = arr')).toEqual(['first', 'third'])
    })
  })

  describe('loops', () => {
    it('for-of', () => {
      expect(extractLoggableIdentifiers('for (const item of list)')).toEqual(['item'])
    })

    it('for-in', () => {
      expect(extractLoggableIdentifiers('for (let key in obj)')).toEqual(['key'])
    })
  })

  describe('catch', () => {
    it('simple catch', () => {
      expect(extractLoggableIdentifiers('catch (err)')).toEqual(['err'])
    })

    it('catch with braces', () => {
      expect(extractLoggableIdentifiers('} catch (error) {')).toEqual(['error'])
    })
  })

  describe('assignment', () => {
    it('simple assignment', () => {
      expect(extractLoggableIdentifiers('x = 5')).toEqual(['x'])
    })

    it('assignment with leading whitespace', () => {
      expect(extractLoggableIdentifiers('  result = getValue()')).toEqual(['result'])
    })
  })

  describe('skip patterns', () => {
    it('import statement', () => {
      expect(extractLoggableIdentifiers('import { foo } from \'bar\'')).toEqual([])
    })

    it('export statement', () => {
      expect(extractLoggableIdentifiers('export const x = 5')).toEqual([])
    })

    it('comment', () => {
      expect(extractLoggableIdentifiers('// const x = 5')).toEqual([])
    })

    it('console statement', () => {
      expect(extractLoggableIdentifiers('console.log(x)')).toEqual([])
    })

    it('empty string', () => {
      expect(extractLoggableIdentifiers('')).toEqual([])
    })
  })

  describe('non-matching lines', () => {
    it('if condition', () => {
      expect(extractLoggableIdentifiers('if (x === 5)')).toEqual([])
    })

    it('return statement', () => {
      expect(extractLoggableIdentifiers('return x')).toEqual([])
    })
  })
})
