import * as Oclif from '@oclif/core'

import * as Utils from '../utilities/index.js'

export default class Logout extends Oclif.Command {
  static override description = 'Deactivate private key.'

  public async run(): Promise<void> {
    const spinner = Utils.getSpinner('Logging out...')
    Utils.wallet.setKeyPath()
    spinner.succeed('Successfully logged out.')
  }
}
