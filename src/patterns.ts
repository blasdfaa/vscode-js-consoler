const SKIP_PATTERN = /^\s*(?:import\s|export\s|\/\/|console\.)/

const DECLARATION_PATTERN = /(?:const|let|var)\s+(\w+)\s*(?::[^=]+=|=)/
const DESTRUCTURE_OBJECT_PATTERN = /(?:const|let|var)\s+\{([^}]+)\}\s*(?::[^=]+=|=)/
const DESTRUCTURE_ARRAY_PATTERN = /(?:const|let|var)\s+\[([^\]]+)\]\s*(?::[^=]+=|=)/
const FOR_OF_IN_PATTERN = /for\s*\(\s*(?:const|let|var)\s+(\w+)\s+(?:of|in)\s/
const CATCH_PATTERN = /catch\s*\(\s*(\w+)\s*\)/
const ASSIGNMENT_PATTERN = /^\s*(\w+)\s*=[^=]/

export function extractLoggableIdentifiers(lineText: string): string[] {
  const trimmed = lineText.trim()
  if (!trimmed || SKIP_PATTERN.test(trimmed))
    return []

  const identifiers: string[] = []

  const destructObj = lineText.match(DESTRUCTURE_OBJECT_PATTERN)
  if (destructObj) {
    const props = destructObj[1].split(',')
    for (const prop of props) {
      const trimmedProp = prop.trim()
      if (!trimmedProp)
        continue
      // handle `b: renamed` → take "renamed"
      const colonIndex = trimmedProp.indexOf(':')
      if (colonIndex !== -1) {
        const renamed = trimmedProp.slice(colonIndex + 1).trim().match(/^(\w+)/)
        if (renamed)
          identifiers.push(renamed[1])
      }
      else {
        // handle default values: `a = 5` → take "a"
        const name = trimmedProp.match(/^(\w+)/)
        if (name)
          identifiers.push(name[1])
      }
    }
    return identifiers
  }

  const destructArr = lineText.match(DESTRUCTURE_ARRAY_PATTERN)
  if (destructArr) {
    const elements = destructArr[1].split(',')
    for (const el of elements) {
      const name = el.trim().match(/^(\w+)/)
      if (name)
        identifiers.push(name[1])
    }
    return identifiers
  }

  const decl = lineText.match(DECLARATION_PATTERN)
  if (decl) {
    identifiers.push(decl[1])
    return identifiers
  }

  const forMatch = lineText.match(FOR_OF_IN_PATTERN)
  if (forMatch) {
    identifiers.push(forMatch[1])
    return identifiers
  }

  const catchMatch = lineText.match(CATCH_PATTERN)
  if (catchMatch) {
    identifiers.push(catchMatch[1])
    return identifiers
  }

  const assignment = lineText.match(ASSIGNMENT_PATTERN)
  if (assignment) {
    identifiers.push(assignment[1])
    return identifiers
  }

  return identifiers
}
