import { defineExtension, useCommand } from 'reactive-vscode'
import { window } from 'vscode'
import { config } from './config'
import { commands } from './generated/meta'
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

    let logStatement: string
    if (text) {
      const template = config.logTemplate
      logStatement = template.replace(/\{selected\}/g, text)
    }
    else {
      logStatement = 'console.log()'
    }

    const insertPosition = currentLine.range.end
    editor.edit((editBuilder) => {
      editBuilder.insert(insertPosition, `\n${indentation}${logStatement}`)
    })
  })
})

export { activate, deactivate }
