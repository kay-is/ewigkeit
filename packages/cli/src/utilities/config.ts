import * as Fs from 'node:fs'
import * as Os from 'node:os'
import * as Path from 'node:path'

export type CliConfig = {
  keyPath?: string
}

export const CLI_CONFIG_PATH = Path.join(Os.homedir(), '.ewig')

export const get = (): CliConfig => {
  if (!Fs.existsSync(CLI_CONFIG_PATH)) return {}
  return JSON.parse(Fs.readFileSync(CLI_CONFIG_PATH, 'utf8'))
}

export function save(config: CliConfig) {
  Fs.writeFileSync(CLI_CONFIG_PATH, JSON.stringify(config, null, 2))
}
