import { window } from 'vscode'
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
  editor.edit((editBuilder) => {
    editBuilder.insert(insertPosition, `\n${indentation}${logStatement}`)
  })
}
