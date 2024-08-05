import * as Oclif from '@oclif/core'

import * as Utils from '../utilities/index.js'

export default class Whoami extends Oclif.Command {
  static override description = 'Show active key and address.'

  public async run() {
    const spinner = Utils.getSpinner("Checking who's logged in ...")

    spinner.info("CLI config: " + Utils.config.CLI_CONFIG_PATH)
    if (process.env.EWIG_KEY) {
      spinner.info('Keyfile: EWIG_KEY environment variable')
    } else {
      const keyPath = Utils.wallet.getKeyPath()
      if (!keyPath) return this.error("You're not logged in.")
      spinner.info(`Keyfile: ${keyPath}`)
    }

    const address = await Utils.wallet.loadAddress()
    spinner.info(`Address: ${address}`)
  }
}
