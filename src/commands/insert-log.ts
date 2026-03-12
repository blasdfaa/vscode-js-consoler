import type { TextEditor } from 'vscode'
import { Position, Selection, window } from 'vscode'
import { buildLogStatement } from '../log'

export function insertLog() {
  const editor = window.activeTextEditor
  if (!editor)
    return

  const selection = editor.selection
  const text = editor.document.getText(selection).trim()

  const currentLine = editor.document.lineAt(selection.end.line)
  const indentation = currentLine.text.match(/^\s*/)?.[0] ?? ''
  const insertLineNumber = selection.end.line + 2
  const logStatement = buildLogStatement(text, insertLineNumber)

  const insertPosition = currentLine.range.end
  const fullLogStatement = `\n${indentation}${logStatement}`

  editor
    .edit((editBuilder) => {
      editBuilder.insert(insertPosition, fullLogStatement)
    })
    .then((success) => {
      if (success) {
        moveCursorToLineEnd(editor, selection.end.line + 1)
      }
    })
}

function moveCursorToLineEnd(editor: TextEditor, line: number) {
  if (line >= editor.document.lineCount)
    return

  const lineText = editor.document.lineAt(line).text
  const newPosition = new Position(line, lineText.length)
  editor.selection = new Selection(newPosition, newPosition)
}
