import * as Oclif from '@oclif/core'

import * as Bundler from '../../bundlers/index.js'
import * as Utils from '../../utilities/index.js'

export default class TurboCreditsBuy extends Oclif.Command {
  static override args = {
    usdAmount: Oclif.Args.integer({description: 'Amount of USD to spend', required: true}),
  }

  static override description = 'Buy tokens to use with the Turbo bundler'

  public async run(): Promise<void> {
    const spinner = Utils.getSpinner('Creating Stripe checkout session...')
    const cliParamters = await this.parse(TurboCreditsBuy)

    const bundler = await Bundler.createBundler('turbo', Utils.wallet.getKey())

    const purchaseUrl = await bundler.buyCredits(cliParamters.args.usdAmount)
    spinner.succeed('Stripe checkout session created.')
    spinner.info('Buy credits here: ' + purchaseUrl)
  }
}
