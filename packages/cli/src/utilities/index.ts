import * as MimeTypes from 'mime'
import * as Crypto from 'node:crypto'
import * as Fs from 'node:fs'
import * as Path from 'node:path'
import * as Ora from 'ora'

export * as ao from './ao.js'
export * as arns from './arns.js'
export * as config from './config.js'
export * as project from './project.js'
export * as wallet from './wallet.js'

export function getSpinner(text: string) {
  return Ora.default(text).start()
}

export function getFilePaths(directoryPath: string, filePaths: string[] = []) {
  for (const file of Fs.readdirSync(directoryPath)) {
    const filePath = Path.join(directoryPath, file)
    if (!Fs.statSync(filePath).isDirectory()) {
      filePaths.push(filePath)
      continue
    }

    filePaths = getFilePaths(filePath, filePaths)
  }

  return filePaths
}

export async function loadDeploymentHashes(): Promise<Record<string, string>> {
  return JSON.parse(Fs.readFileSync('.ewig/deployment-hashes.json', 'utf8'))
}

export async function saveDeploymentHashes(deployedFileHashes: Record<string, string>) {
  Fs.writeFileSync('.ewig/deployment-hashes.json', JSON.stringify(deployedFileHashes, null, 2))
}

export function getFileHash(filePath: string) {
  return Crypto.createHash('sha256').update(Fs.readFileSync(filePath)).digest('hex')
}

export function getMimeType(filePath: string) {
  return MimeTypes.default.getType(filePath) ?? 'application/octet-stream'
}
