import { defineExtension, useCommand, useDisposable } from 'reactive-vscode'
import { CodeActionKind, languages, window } from 'vscode'
import { config } from './config'
import { commands } from './generated/meta'
import { buildLogStatement } from './log'
import { ConsoleLogActionProvider, SUPPORTED_LANGUAGES } from './providers/console-log-action'
import { logger } from './utils'

const { activate, deactivate } = defineExtension(() => {
  logger.info('JS Consoler activated')

  useCommand(commands.insertLog, () => {
    const editor = window.activeTextEditor
    if (!editor)
      return

    const selection = editor.selection
    const text = editor.document.getText(selection).trim()

    const currentLine = editor.document.lineAt(selection.end.line)
    const indentation = currentLine.text.match(/^\s*/)?.[0] ?? ''
    const logStatement = buildLogStatement(text)

    const insertPosition = currentLine.range.end
    editor.edit((editBuilder) => {
      editBuilder.insert(insertPosition, `\n${indentation}${logStatement}`)
    })
  })

  if (config.enableCodeActions) {
    useDisposable(
      languages.registerCodeActionsProvider(
        SUPPORTED_LANGUAGES.map(lang => ({ language: lang })),
        new ConsoleLogActionProvider(),
        { providedCodeActionKinds: [CodeActionKind.Refactor] },
      ),
    )
  }
})

export { activate, deactivate }
