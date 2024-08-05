import * as Oclif from '@oclif/core'

import * as Bundler from '../../bundlers/index.js'
import * as Utils from '../../utilities/index.js'

export default class TurboCreditsBalance extends Oclif.Command {
  static override description = 'Get your token balance for the Turbo bundler'

  public async run(): Promise<void> {
    const spinner = Utils.getSpinner('Loading Turbo Credit balance...')

    const bundler = await Bundler.createBundler('turbo', Utils.wallet.getKey())

    const balance = await bundler.getBalance()

    spinner.succeed('Balance loaded.')
    spinner.info(`Balance in TC :  ${balance.tc}`)
    spinner.info(`Balance in USD: ~${balance.usd.toFixed(2)}`)
  }
}
