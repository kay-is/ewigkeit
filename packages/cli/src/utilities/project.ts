/* eslint-disable perfectionist/sort-objects */
import * as ChildProcess from 'node:child_process'
// Disabled to keep config keys in order
import * as Fs from 'node:fs'
import * as Path from 'node:path'
import * as Url from 'node:url'

import * as Bundlers from '../bundlers/index.js'
import * as Ao from './ao.js'
import * as Arns from './arns.js'
import * as Wallet from './wallet.js'

type EwigProjectJson = {
  projectId: string
}

export type ProjectConfig = {
  bundler: 'turbo'
  outputDirectory?: string
}

const UTILS_DIRECTORY = Path.dirname(Url.fileURLToPath(import.meta.url))
const CLI_DIRECTORY = Path.resolve(Path.join(UTILS_DIRECTORY, '..', '..'))
const PROJECT_CODE = Fs.readFileSync(Path.join(CLI_DIRECTORY, 'dist/project.lua'), {
  encoding: 'utf8',
})

export const initProcess = (name: string) => {
  const codeWithProjectValues = PROJECT_CODE.replaceAll('<NAME>', name)
    .replaceAll('<TICKER>', 'ATOMIC')
    .replaceAll('<DENOMINATION>', '1')
    .replaceAll('<BALANCE>', '1')

  return Ao.spawn(codeWithProjectValues, {Application: 'Ewig', Type: 'Project', Name: name})
}

export const linkToProcess = (projectId: string) => {
  if (!Fs.existsSync('.ewig')) Fs.mkdirSync('.ewig')

  const initialProjectConfig: ProjectConfig = {bundler: 'turbo', outputDirectory: 'dist'}
  Fs.writeFileSync('ewig.json', JSON.stringify(initialProjectConfig, null, 2))

  const initialEwigProjectJson: EwigProjectJson = {projectId}
  Fs.writeFileSync('.ewig/project.json', JSON.stringify(initialEwigProjectJson, null, 2))

  return projectId
}

export const getConfig = (): ProjectConfig => JSON.parse(Fs.readFileSync('ewig.json', 'utf8'))

export const getId = (): string =>
  JSON.parse(Fs.readFileSync('.ewig/project.json', 'utf8')).projectId

export const addArnsDomain = async (arnsDomain: string) => {
  const antAddress = await Arns.loadAntAddress(arnsDomain)
  await Ao.send(getId(), 'Add-Ant', {AntAddress: antAddress, ArnsDomain: arnsDomain})
}

export const removeArnsDomain = async (arnsDomain: string) => {
  await Ao.send(getId(), 'Remove-Ant', {ArnsDomain: arnsDomain})
}

export type DeploymentInput = {
  createdAt: number
  deploymentId: string
  environment: Bundlers.Environment
}
export const addDeployment = async (deployment: DeploymentInput) => {
  const tags = {
    CreatedAt: deployment.createdAt.toString(),
    CreatedBy: await Wallet.loadAddress(),
    Environment: deployment.environment,
    DeploymentId: deployment.deploymentId,
    Branch: '',
  }

  if (deployment.environment === 'preview')
    tags.Branch = ChildProcess.execSync('git branch --show-current', {
      encoding: 'utf8',
    }).trim()

  await Ao.send(getId(), 'Add-Deployment', tags)
}

export const assignArnsDomainToDeployment = async (deploymentId: string) => {
  const response = await Ao.send<{Data: {ArnsDomain: string}}>(
    getId(),
    'Assign-Domain-To-Deployment',
    {DeploymentId: deploymentId},
  )
  return response.Data.ArnsDomain
}

export const loadArnsDomains = async () => {
  const response = await Ao.read<{Data: {Ants: Record<string, string>}}>(getId(), 'Info')
  return Object.keys(response.Data.Ants)
}

export type Deployment =
  | {
      Branch: string
      CreatedAt: number
      CreatedBy: string
      Environment: 'preview'
      Id: string
    }
  | {
      CreatedAt: number
      CreatedBy: string
      Environment: 'production'
      Id: string
    }

export type ProjectInfo = {
  ActiveDeployments: {
    preview: Record<string, string>
    production: string
  }
  Ants: Record<string, string>
  Deployments: DeploymentInput[]
  Description: string
  Domains: {
    preview: Record<string, string>
    production: string
  }
  Id: string
  Members: {Address: string; Name: string}[]
  Name: string
}

export const loadInfo = async () => {
  const response = await Ao.read<{Data: ProjectInfo}>(getId(), 'Info')
  return response.Data
}

export const addDeploymentHashes = async (newHashes: Record<string, string>) => {
  await Ao.send(getId(), 'Add-Deployment-Hashes', {}, newHashes)
}

export const loadDeploymentHashes = async () => {
  const response = await Ao.read<{Data: Record<string, string>}>(getId(), 'Get-Deployment-Hashes')
  return response.Data
}
