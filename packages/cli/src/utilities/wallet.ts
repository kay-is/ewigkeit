import Arweave from 'arweave'
import * as ArweaveWallet from 'arweave/node/lib/wallet.js'
import * as Fs from 'node:fs'
import * as Path from 'node:path'

import * as Config from './config.js'

export const generateKey = async () => {
  const arweave = Arweave.init({})

  const key = await arweave.wallets.generate()
  const address = await arweave.wallets.jwkToAddress(key)
  const keyPath = Path.join(Config.CLI_CONFIG_PATH, '..', `ewig.${address}.json`)
  Fs.writeFileSync(keyPath, JSON.stringify(key))

  return keyPath
}

export const setKeyPath = (keyPath?: string) => {
  const config = Config.get()

  if (keyPath) config.keyPath = Path.resolve(keyPath)
  else delete config.keyPath

  Config.save(config)
}

export const getKeyPath = () => Config.get().keyPath

export const loadAddress = async () => Arweave.init({}).wallets.jwkToAddress(getKey())

export const getKey = (): ArweaveWallet.JWKInterface => {
  if (process.env.EWIG_KEY) return JSON.parse(process.env.EWIG_KEY)

  const keyPath = getKeyPath()

  if (!keyPath) throw new Error('No key file found at: ' + keyPath)

  return JSON.parse(Fs.readFileSync(keyPath, 'utf8'))
}
