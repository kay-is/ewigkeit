import * as TurboSdk from '@ardrive/turbo-sdk/node'
import * as ArweaveWallet from 'arweave/node/lib/wallet.js'
import * as Fs from 'node:fs'

import * as Constants from '../utilities/constants.js'
import * as Utils from '../utilities/index.js'
import * as Base from './base.js'
import * as BundlersIndex from './index.js'

const HUNDRED_KILOBYTES = 102_400

export default class TurboBundler extends Base.Bundler {
  #turbo?: TurboSdk.TurboAuthenticatedClient

  async buyCredits(usdAmount: number) {
    const owner = await Utils.wallet.loadAddress()
    // eslint-disable-next-line new-cap
    const amount = TurboSdk.USD(usdAmount)
    const result = await this.#turbo?.createCheckoutSession({amount, owner})

    if (!result || !result.url) throw new Error('Failed to create checkout session')

    return result.url
  }

  async getBalance() {
    const balance = await this.#turbo?.getBalance()

    if (!balance) throw new Error('Failed to get balance')

    const tc = Number(balance.winc) / Constants.WINC_TO_TC_FACTOR
    const rateResponse = await this.#turbo?.getFiatToAR({currency: 'usd'})

    if (!rateResponse) throw new Error('Failed to get conversion rate')

    const usd = tc * rateResponse.rate

    return {tc, usd}
  }

  async getUploadCosts(directoryPath: string) {
    const deploymentFiles = await this.getCachedAndUncachedFiles(directoryPath)

    const fileSizes = deploymentFiles.uncached.map((file) => Fs.statSync(file.path).size)

    const uploadCosts = await this.#turbo?.getUploadCosts({
      bytes: fileSizes,
    })

    if (!uploadCosts) throw new Error('Failed to get upload costs')

    const filePathsWithCosts: Record<string, {cost: number; size: number}> = {}
    for (const [index, uploadCost] of uploadCosts.entries()) {
      if (fileSizes[index] < HUNDRED_KILOBYTES) continue

      filePathsWithCosts[deploymentFiles.uncached[index].path] = {
        cost: Number(uploadCost.winc) / Constants.WINC_TO_TC_FACTOR,
        size: fileSizes[index],
      }
    }

    const rateResponse = await this.#turbo?.getFiatToAR({currency: 'usd'})

    if (!rateResponse) throw new Error('Failed to get conversion rate')

    for (const file of Object.values(filePathsWithCosts)) file.cost /= rateResponse.rate

    return filePathsWithCosts
  }

  initialize(key: ArweaveWallet.JWKInterface, environment: BundlersIndex.Environment) {
    this.environment = environment
    this.#turbo = TurboSdk.TurboFactory.authenticated({privateKey: key})
  }

  async uploadFile(filePath: string, tags: Record<string, string>): Promise<string> {
    const tagsArray = Object.entries(tags).map(([name, value]) => ({name, value}))
    tagsArray.push({name: 'Environment', value: this.environment})

    const uploadResult = await this.#turbo?.uploadFile({
      dataItemOpts: {tags: tagsArray},
      fileSizeFactory: () => Fs.statSync(filePath).size,
      fileStreamFactory: () => Fs.createReadStream(filePath),
    })
    if (!uploadResult) throw new Error('Failed to upload file')

    return uploadResult.id
  }
}
