import type { CancellationToken, CodeActionContext, Range, TextDocument } from 'vscode'
import { CodeAction, CodeActionKind, Position, WorkspaceEdit } from 'vscode'
import { displayName } from '../generated/meta'
import { buildLogStatement } from '../log'
import { extractLoggableIdentifiers } from '../patterns'

function actionTitle(label: string): string {
  return `${displayName}: ${label}`
}

export const SUPPORTED_LANGUAGES = [
  'javascript',
  'javascriptreact',
  'typescript',
  'typescriptreact',
  'vue',
  'svelte',
]

export class ConsoleLogActionProvider {
  static readonly providedCodeActionKinds = [CodeActionKind.Refactor]

  provideCodeActions(
    document: TextDocument,
    range: Range,
    _context: CodeActionContext,
    _token: CancellationToken,
  ): CodeAction[] {
    const selectedText = document.getText(range).trim()

    if (selectedText) {
      return [this.createInsertLogAction(document, range, selectedText, actionTitle(`Log '${selectedText}'`))]
    }

    const line = document.lineAt(range.start.line)
    const identifiers = extractLoggableIdentifiers(line.text)

    return identifiers.map(id =>
      this.createInsertLogAction(document, range, id, actionTitle(`Log variable '${id}'`)),
    )
  }

  private createInsertLogAction(
    document: TextDocument,
    range: Range,
    text: string,
    title: string,
  ): CodeAction {
    const action = new CodeAction(title, CodeActionKind.Refactor)

    const line = document.lineAt(range.start.line)
    const indentation = line.text.match(/^\s*/)?.[0] ?? ''
    const insertLineNumber = range.start.line + 2
    const logStatement = buildLogStatement(text, insertLineNumber)
    const insertPosition = new Position(line.range.end.line, line.range.end.character)

    const edit = new WorkspaceEdit()
    edit.insert(document.uri, insertPosition, `\n${indentation}${logStatement}`)
    action.edit = edit

    return action
  }
}
