import { config } from './config'

export function buildLogStatement(text: string): string {
  if (!text)
    return 'console.log()'

  return config.logTemplate.replace(/\{selected\}/g, text)
}
