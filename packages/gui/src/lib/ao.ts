import * as AoConnect from '@permaweb/aoconnect'

export async function read<Result = Record<string, string>>(
  target: string,
  action: string,
): Promise<Result> {
  const requestId = crypto.randomUUID()
  const result = await AoConnect.dryrun({
    process: target,
    tags: [
      { name: 'Action', value: action },
      { name: 'RequestId', value: requestId },
    ],
  })

  result.Messages.forEach((message) => {
    if (message.Tags.Error) throw new Error(message.Tags.Error)
  })

  let response = result.Messages.find((r) => r.Tags.ResponseFor === requestId)

  if (!response) response = result.Messages.pop()

  return JSON.parse(response.Data) as Result
}

export async function send<Result = Record<string, string>>(
  target: string,
  action: string,
  tags: Record<string, string> = {},
  data?: string | object,
) {
  const requestId = crypto.randomUUID()
  if (typeof data === 'object') data = JSON.stringify(data)
  const message = await AoConnect.message({
    data,
    process: target,
    signer: AoConnect.createDataItemSigner(window.arweaveWallet),
    tags: [
      { name: 'Action', value: action },
      { name: 'RequestId', value: requestId },
      ...Object.entries(tags).map(([name, value]) => ({ name, value })),
    ],
  })
  const result = await AoConnect.result({ message, process: target })

  result.Messages.forEach((message) => {
    if (message.Tags.Error) throw new Error(message.Tags.Error)
  })

  let response = result.Messages.find((r) => r.Tags.ResponseFor == requestId)

  if (!response) response = result.Messages.pop()

  try {
    return JSON.parse(response.Data ?? '') as Result
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return response.Data
  }
}

export async function spawn(luaCode: string, tags: Record<string, string>): Promise<string> {
  const processId = await AoConnect.spawn({
    module: 'SBNb1qPQ1TDwpD_mboxm2YllmMLXpWw4U8P9Ff8W9vk',
    scheduler: '_GQ33BkPtZrqxA84vM8Zk-N2aO0toNNu_C-l-rawrBA',
    signer: AoConnect.createDataItemSigner(window.arweaveWallet),
    tags: Object.entries(tags).map(([name, value]) => ({ name, value })),
  })

  await new Promise((resolve) => {
    setTimeout(resolve, 5000)
  })

  await send(processId, 'Eval', {}, luaCode)

  return processId
}
