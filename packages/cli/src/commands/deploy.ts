import * as Oclif from '@oclif/core'
import * as Fs from 'node:fs'

import * as Bundler from '../bundlers/index.js'
import * as Constants from '../utilities/constants.js'
import * as Utils from '../utilities/index.js'

export default class Deploy extends Oclif.Command {
  static override description = 'Deploys the current project.'

  static override flags = {
    prod: Oclif.Flags.boolean({
      description: 'Deploy to production and assign main ArNS domain.',
    }),
    'skip-domain': Oclif.Flags.boolean({
      description: 'Prevent ArNS domain assing when deploying in production.',
    }),
    'skip-registration': Oclif.Flags.boolean({
      description: 'Prevents deployment from registering with AO process, disables cache updates.',
    }),
  }

  public async run() {
    const cliParameters = await this.parse(Deploy)
    const environment: Bundler.Environment = cliParameters.flags.prod ? 'production' : 'preview'

    const projectConfig = Utils.project.getConfig()

    if (!projectConfig.bundler) this.error('Bundler not set in project config.')
    if (!projectConfig.outputDirectory) this.error('OutputDirectory not set in project config.')
    if (!Fs.existsSync(projectConfig.outputDirectory))
      this.error('outputDirectory does not exist: ' + projectConfig.outputDirectory)

    const spinner = Utils.getSpinner(
      `Deploying "${environment}" new release with ${projectConfig.bundler} bundler...`,
    )

    const bundler = await Bundler.createBundler(
      projectConfig.bundler,
      Utils.wallet.getKey(),
      environment,
    )

    const deploymentId = await bundler.uploadDirectory(
      projectConfig.outputDirectory,
      cliParameters.flags['skip-registration'],
    )
    spinner.info(`"${environment}" release successfully deployed.`)

    const deploymentUrl = `https://${Constants.ARWEAVE_GATEWAY}/${deploymentId}/`

    if (cliParameters.flags['skip-registration']) return this.log(deploymentUrl)

    spinner.info('Registering deployment with project...')
    await Utils.project.addDeployment({
      createdAt: Date.now(),
      deploymentId,
      environment: cliParameters.flags.prod ? 'production' : 'preview',
    })
    spinner.info('Deployment successfully registered.')

    if (cliParameters.flags['skip-domain']) return this.log(deploymentUrl)

    deploymentId
    spinner.info('Assigning ArNS domain deployment...')
    const result = await Utils.project.assignArnsDomainToDeployment(deploymentId)
    spinner.succeed('Domain successfully assigned.')

    spinner.info(`Plain URL: ${deploymentUrl}`)

    this.log(`https://${result}.${Constants.ARWEAVE_GATEWAY}/`)
  }
}
