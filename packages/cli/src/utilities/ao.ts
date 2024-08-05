import * as AoConnect from '@permaweb/aoconnect'
import * as Crypto from 'node:crypto'

import * as Constants from './constants.js'
import * as Wallet from './wallet.js'

type Message = {
  Tags: {name: string; value: string}[]
}

const getTags = (message: Message) => {
  const result: Record<string, string> = {}
  for (const tag of message.Tags) result[tag.name] = tag.value
  return result
}

export const read = async <Result = Record<string, string>>(
  target: string,
  action: string,
): Promise<Result> => {
  const requestId = Crypto.randomUUID()
  const result = await AoConnect.dryrun({
    process: target,
    tags: [
      {name: 'Action', value: action},
      {name: 'RequestId', value: requestId},
    ],
  })

  for (const message of result.Messages) {
    const error = getTags(message).Error
    if (error) throw new Error(error)
  }

  let response = result.Messages.find((response) => getTags(response).ResponseFor === requestId)

  if (!response) response = result.Messages.pop()

  if (response.Data) response.Data = JSON.parse(response.Data)

  return response as Result
}

export const send = async <Result = Record<string, string>>(
  target: string,
  action: string,
  tags: Record<string, string> = {},
  data?: object | string,
): Promise<Result> => {
  const requestId = Crypto.randomUUID()
  if (typeof data === 'object') data = JSON.stringify(data)
  const message = await AoConnect.message({
    data,
    process: target,
    signer: AoConnect.createDataItemSigner(Wallet.getKey()),
    tags: [
      {name: 'Action', value: action},
      {name: 'RequestId', value: requestId},
      ...Object.entries(tags).map(([name, value]) => ({name, value})),
    ],
  })
  const result = await AoConnect.result({message, process: target})

  for (const message of result.Messages) {
    const error = getTags(message).Error
    if (error) throw new Error(error)
  }

  let response = result.Messages.find((response) => getTags(response).ResponseFor === requestId)

  if (!response) response = result.Messages.pop()

  if (response.Data) response.Data = JSON.parse(response.Data)

  return response as Result
}

export const spawn = async (luaCode: string, tags: Record<string, string>): Promise<string> => {
  const processId = await AoConnect.spawn({
    module: Constants.AOS_MODULE_TXID,
    scheduler: Constants.SCHEDULER_ID,
    signer: AoConnect.createDataItemSigner(Wallet.getKey()),
    tags: Object.entries(tags).map(([name, value]) => ({name, value})),
  })

  await new Promise((resolve) => {
    setTimeout(resolve, 5000)
  })

  await send(processId, 'Eval', {}, luaCode)

  return processId
}
