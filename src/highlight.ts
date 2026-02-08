import type { Range, TextDocument, TextEditor } from 'vscode'
import { useActiveTextEditor, useEditorDecorations } from 'reactive-vscode'
import { ThemeColor } from 'vscode'
import { SUPPORTED_LANGUAGES } from './languages'

const CONSOLE_PATTERN = /^\s*console\.\w+\s*\(/m

function findConsoleRanges(document: TextDocument): Range[] {
  return document
    .getText()
    .split('\n')
    .reduce<Range[]>((ranges, lineText, i) => {
      if (CONSOLE_PATTERN.test(lineText))
        ranges.push(document.lineAt(i).range)
      return ranges
    }, [])
}

export function setupHighlight(): void {
  const editor = useActiveTextEditor()

  useEditorDecorations(
    editor,
    {
      backgroundColor: new ThemeColor('jsConsoler.highlightBackground'),
      isWholeLine: true,
    },
    (editor: TextEditor) => {
      if (!SUPPORTED_LANGUAGES.includes(editor.document.languageId))
        return []
      return findConsoleRanges(editor.document)
    },
  )
}
