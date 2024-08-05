import * as Oclif from '@oclif/core'

import * as Utils from '../utilities/index.js'

export default class Link extends Oclif.Command {
  static override args = {
    'project-id': Oclif.Args.string({
      description: "The address of the project's AO process",
      required: true,
    }),
  }

  static override description = 'Links the current project to an existing AO process'

  public async run(): Promise<void> {
    const cliParameters = await this.parse(Link)

    const spinner = Utils.getSpinner('Linking project...')

    const projectId = cliParameters.args['project-id']

    await Utils.project.linkToProcess(projectId)

    spinner.succeed('Project successfully linked.')
  }
}
