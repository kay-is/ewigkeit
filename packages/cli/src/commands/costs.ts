import * as Oclif from '@oclif/core'
import * as Fs from 'node:fs'

import * as Bundler from '../bundlers/index.js'
import * as Utils from '../utilities/index.js'

const renderCosts = (costs: number) => (costs < 0.01 ? '<$0.01' : `~$${costs.toFixed(2)}`)

export default class Costs extends Oclif.Command {
  static override description = 'Estimate the costs of deploying the project.'

  public async run(): Promise<void> {
    const spinner = Utils.getSpinner(`Estimating costs of deployment...`)

    const projectConfig = Utils.project.getConfig()

    const bundler = await Bundler.createBundler(projectConfig.bundler, Utils.wallet.getKey())

    if (!projectConfig.outputDirectory) this.error('OutputDirectory not set in project config.')
    if (!Fs.existsSync(projectConfig.outputDirectory))
      this.error('outputDirectory does not exist: ' + projectConfig.outputDirectory)

    const costs = await bundler.getUploadCosts(projectConfig.outputDirectory)
    spinner.info('Deployment files: ')

    for (const [filePath, {cost, size}] of Object.entries(costs)) {
      spinner.info(`  ${filePath} (~${Math.round(size / 1024)}KiB): ${renderCosts(cost)}`)
    }

    const totalCosts = Object.values(costs).reduce((sum, x) => sum + x.cost, 0)
    spinner.info(`Total Costs ${renderCosts(totalCosts)}`)

    spinner.info(
      'Note: Previously uploaded files and files under 100KiB are free and not part of this calculation.',
    )
  }
}
