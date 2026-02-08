import { defineExtension, useCommands, useDisposable } from 'reactive-vscode'
import { CodeActionKind, languages } from 'vscode'
import { insertLog } from './commands'
import { config } from './config'
import { commands } from './generated/meta'
import { setupHighlight } from './highlight'
import { SUPPORTED_LANGUAGES } from './languages'
import { ConsoleLogActionProvider } from './providers/console-log-action'
import { logger } from './utils'

const { activate, deactivate } = defineExtension(() => {
  logger.info('JS Consoler activated')

  useCommands({
    [commands.insertLog]: insertLog,
  })

  if (config.enableHighlight) {
    setupHighlight()
  }

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
