import * as Oclif from '@oclif/core'

import * as Utils from '../utilities/index.js'

export default class Inspect extends Oclif.Command {
  static override description = 'Load the project info from AO.'

  static override flags = {
    json: Oclif.Flags.boolean({description: 'Switch to JSON output.'}),
  }

  public async run(): Promise<void> {
    const cliParameters = await this.parse(Inspect)
    const spinner = Utils.getSpinner(`Loading project info...`)

    const projectInfo = await Utils.project.loadInfo()

    if (cliParameters.flags.json) return this.log(JSON.stringify(projectInfo))

    spinner.info('ID         : ' + projectInfo.Id)
    spinner.info('Name       : ' + projectInfo.Name)
    spinner.info('Description: ' + projectInfo.Description)
    spinner.info('')
    spinner.info(`Members (${projectInfo.Members.length}):`)
    for (const member of projectInfo.Members) spinner.info(`  - ${member.Name} (${member.Address})`)

    spinner.info('')
    spinner.info(`Production Domain:`)
    spinner.info(
      `  - ${projectInfo.Domains.production === '' ? 'N/A' : projectInfo.Domains.production}`,
    )

    spinner.info('')
    spinner.info(`Preview Domains (${Object.keys(projectInfo.Domains.preview).length}):`)
    for (const [branch, arnsDomain] of Object.entries(projectInfo.Domains.preview))
      spinner.info(`  - ${arnsDomain} (${branch})`)

    spinner.info('')
    spinner.info(`ArNS Domains (${Object.keys(projectInfo.Ants).length}):`)
    for (const [arnsDomain, antAddress] of Object.entries(projectInfo.Ants))
      spinner.info(`  - ${arnsDomain} (${antAddress})`)

    spinner.info('')
    spinner.info(`Web Console: https://ewigkeit.ar-io.dev/project/${projectInfo.Id}/overview`)
  }
}
