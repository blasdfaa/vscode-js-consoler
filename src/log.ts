import { config } from './config'

export function buildLogStatement(text: string, lineNumber?: number): string {
  if (!text)
    return 'console.log()'

  return config.logTemplate
    .replace(/\{selected\}/g, text)
    .replace(/\{line\}/g, lineNumber != null ? String(lineNumber) : '')
}
