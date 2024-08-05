import * as ArweaveModule from 'arweave/node/lib/wallet.js'

import * as TurboBundlerModule from './turbo.js'

export type Environment = 'preview' | 'production'
export type BundlerTypes = 'turbo'

const BundlerClasses = {
  turbo: TurboBundlerModule.default,
}

export async function createBundler(
  type: BundlerTypes,
  privateKey: ArweaveModule.JWKInterface,
  environment: Environment = 'preview',
) {
  const bundler = new BundlerClasses[type]()
  bundler.initialize(privateKey, environment)
  return bundler
}
