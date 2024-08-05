import * as ArioSdk from '@ar.io/sdk'

import * as Ao from './ao.js'

export type ArnsDomainInfo = {
  AntAddress: string
  Balances: Record<string, number>
  Controllers: string[]
  Denomination: number
  Initialized: boolean
  Logo: string
  Name: string
  Owner: string
  Records: Record<string, {transactionId: string; ttlSeconds: number}>
  Ticker: string
  TotalSupply: number
}

export const loadDomainInfo = async (arnsDomain: string): Promise<ArnsDomainInfo> => {
  const antAddress = await loadAntAddress(arnsDomain)
  const domainInfo = await Ao.read<ArnsDomainInfo>(antAddress, 'State')
  domainInfo.AntAddress = antAddress
  return domainInfo
}

export const loadAntAddress = async (arnsDomain: string) => {
  const record = await ArioSdk.IO.init().getArNSRecord({name: arnsDomain})
  if (!record) throw new Error(`ArNS domain "${arnsDomain}" not found.`)
  return record.processId
}
