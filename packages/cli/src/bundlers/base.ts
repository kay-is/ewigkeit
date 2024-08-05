import * as ArweaveModule from 'arweave/node/lib/wallet.js'
import * as Fs from 'node:fs'

import * as Utils from '../utilities/index.js'
import * as BundlerIndex from './index.js'

type File = {hash: string; path: string; txId: string}

export abstract class Bundler {
  protected environment: BundlerIndex.Environment = 'preview'

  async getCachedAndUncachedFiles(directoryPath: string) {
    let deploymentHashes = await Utils.project.loadDeploymentHashes()
    if (Object.keys(deploymentHashes).length === 0) deploymentHashes = {}
    const fileHashesAndPaths = Utils.getFilePaths(directoryPath).map((path) => ({
      hash: Utils.getFileHash(path),
      path,
    }))
    const cached: File[] = fileHashesAndPaths
      .filter((file) => Boolean(deploymentHashes[file.hash]))
      .map((file) => ({...file, txId: deploymentHashes[file.hash]}))

    const uncached = fileHashesAndPaths.filter((file) => !deploymentHashes[file.hash])

    return {cached, uncached}
  }

  async uploadDirectory(directoryPath: string, updateCache = true) {
    const deploymentFiles = await this.getCachedAndUncachedFiles(directoryPath)

    const newDeploymentHashes: Record<string, string> = {}
    const newFiles = await Promise.all(
      deploymentFiles.uncached.map(
        (file) =>
          new Promise<File>((resolve) => {
            this.uploadFile(file.path, {
              'Content-Type': Utils.getMimeType(file.path),
            }).then((txId) => {
              newDeploymentHashes[file.hash] = txId
              resolve({...file, txId})
            })
          }),
      ),
    )

    if (updateCache) await Utils.project.addDeploymentHashes(newDeploymentHashes)

    {
      const pathManifest = {
        manifest: 'arweave/paths',
        version: '0.2.0',
        // eslint-disable-next-line perfectionist/sort-objects
        index: {path: 'index.html'},
        // eslint-disable-next-line perfectionist/sort-objects
        fallback: {} as {id: string},
        paths: {} as Record<string, {id: string}>,
      }

      const deployedFiles = [...deploymentFiles.cached, ...newFiles]
      for (const file of deployedFiles) {
        const path = file.path.replace(`${directoryPath}/`, '')
        pathManifest.paths[path] = {id: file.txId}
      }

      pathManifest.fallback = pathManifest.paths[pathManifest.index.path]

      Fs.writeFileSync('.ewig/path-manifest.json', JSON.stringify(pathManifest, null, 2))
    }

    const txId = await this.uploadFile('.ewig/path-manifest.json', {
      'Content-Type': 'application/x.arweave-manifest+json',
    })
    return txId
  }

  abstract buyCredits(usdAmount: number): Promise<string>

  abstract getBalance(): Promise<{tc: number; usd: number}>

  abstract getUploadCosts(
    uploadDirectory: string,
  ): Promise<Record<string, {cost: number; size: number}>>

  abstract initialize(
    privateKey: ArweaveModule.JWKInterface,
    environment: BundlerIndex.Environment,
  ): void

  abstract uploadFile(filePath: string, tags: Record<string, string>): Promise<string>
}
