import * as Oclif from '@oclif/core'
import * as Fs from 'node:fs'
import * as Path from 'node:path'

import * as Utils from '../utilities/index.js'

export default class Init extends Oclif.Command {
  static override args = {
    projectName: Oclif.Args.string({description: 'Name of the new project.'}),
  }

  static override description = 'Initialize a new Ewig project in the current directory.'

  static override flags = {
    force: Oclif.Flags.boolean({char: 'f', description: 'Override previous initialization.'}),
  }

  public async run() {
    const cliParameters = await this.parse(Init)

    if (Fs.existsSync('.ewig/project.json') && !cliParameters.flags.force)
      this.error('Project already initialized. Use --force to reinitialize.')

    const spinner = Utils.getSpinner('Initializing project ...')

    const name = cliParameters.args.projectName ?? Path.basename(Path.resolve())

    const projectId = await Utils.project.initProcess(name)

    await Utils.project.linkToProcess(projectId)

    spinner.info(`Project Name: ${name}`)
    spinner.info(`Project ID: ${projectId}`)
    spinner.succeed(`Initialized new project`)
    this.log(projectId)
  }
}
