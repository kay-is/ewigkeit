import * as Oclif from '@oclif/core'
import * as Path from 'node:path'

import * as Utils from '../utilities/index.js'

export default class Login extends Oclif.Command {
  static override args = {
    keyfile: Oclif.Args.string({description: 'Path to your JWK file.'}),
  }

  static override description = 'Activate a private key.'

  public async run(): Promise<void> {
    const spinner = Utils.getSpinner('Logging in...')
    const cliParameters = await this.parse(Login)

    let keyPath = cliParameters.args.keyfile

    if (!keyPath) {
      spinner.info('No keyfile provided. Generating new one...')
      keyPath = await Utils.wallet.generateKey()
    }

    Utils.wallet.setKeyPath(keyPath)
    spinner.info('Keyfile: ' + Path.resolve(keyPath))
    spinner.info('Address: ' + (await Utils.wallet.loadAddress()))
    spinner.succeed('Successfully logged in.')
  }
}
