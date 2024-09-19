import {
  createDataItemSigner,
  dryrun,
  message,
  result,
  spawn,
} from "@permaweb/aoconnect"
import { IO_PROCESS_ID } from "./constants"

export type CreateProjectInput = {
  name: string
  description: string
  denomination: number
  ticker: string
}

export const createProject = async (newProject: CreateProjectInput) => {
  const projectCodeTemplate = await fetch("./assets/project.lua").then(
    (response) => response.text()
  )

  const newProjectId = await spawn({
    module: "SBNb1qPQ1TDwpD_mboxm2YllmMLXpWw4U8P9Ff8W9vk",
    scheduler: "_GQ33BkPtZrqxA84vM8Zk-N2aO0toNNu_C-l-rawrBA",
    signer: createDataItemSigner(window.arweaveWallet),
    tags: [{ name: "Name", value: newProject.name }],
  })

  await new Promise((resolve) => setTimeout(resolve, 5000))

  const projectCode = projectCodeTemplate
    .replaceAll("<NAME>", newProject.name)
    .replaceAll("<DESCRIPTION>", newProject.description)
    .replaceAll("<DENOMINATION>", newProject.denomination.toString())
    .replaceAll("<TICKER>", newProject.ticker)

  const requestId = crypto.randomUUID()
  const messageId = await message({
    process: newProjectId,
    signer: createDataItemSigner(window.arweaveWallet),
    data: projectCode,
    tags: [
      { name: "Action", value: "Eval" },
      { name: "RequestId", value: requestId },
    ],
  })

  const { Messages } = await result({
    message: messageId,
    process: newProjectId,
  })

  Messages.forEach((message) => {
    if (message.Tags.Error) throw new Error(message.Tags.Error)
  })

  return newProjectId
}

export const addAnt = async (projectId: string, arnsDomain: string) => {
  const getRecordResult = await dryrun({
    process: IO_PROCESS_ID,
    tags: [
      { name: "Action", value: "Record" },
      { name: "Name", value: arnsDomain },
    ],
  })

  if (!getRecordResult.Messages[0].Data)
    throw new Error("ArNS domain not found")

  const antAddress = JSON.parse(getRecordResult.Messages[0].Data).processId

  let messageId = await message({
    process: projectId,
    signer: createDataItemSigner(window.arweaveWallet),
    data: arnsDomain,
    tags: [
      { name: "Action", value: "Add-Ant" },
      { name: "RequestId", value: crypto.randomUUID() },
      { name: "ArnsDomain", value: arnsDomain },
      { name: "AntAddress", value: antAddress },
    ],
  })

  const addAntResult = await result({ message: messageId, process: projectId })

  addAntResult.Messages.forEach((message) => {
    const error = message.Tags.find(
      (tag: { name: string }) => tag.name === "Error"
    )
    if (error) throw new Error(error.value)
  })

  messageId = await message({
    process: antAddress,
    signer: createDataItemSigner(window.arweaveWallet),
    tags: [
      { name: "Action", value: "Add-Controller" },
      { name: "Controller", value: projectId },
    ],
  })

  const addControllerResponse = await result({
    message: messageId,
    process: antAddress,
  })

  addControllerResponse.Messages.forEach((message) => {
    const error = message.Tags.find(
      (tag: { name: string }) => tag.name === "Error"
    )
    if (error) throw new Error("Could not add controller.")
  })
}

export const removeAnt = async (
  projectId: string,
  arnsDomain: string,
  antAddress: string
) => {
  const messageId = await message({
    process: projectId,
    signer: createDataItemSigner(window.arweaveWallet),
    tags: [
      { name: "Action", value: "Remove-Ant" },
      { name: "RequestId", value: crypto.randomUUID() },
      { name: "ArnsDomain", value: arnsDomain },
    ],
  })

  const removeAntResult = await result({
    message: messageId,
    process: projectId,
  })

  removeAntResult.Messages.forEach((message) => {
    const error = message.Tags.find(
      (tag: { name: string }) => tag.name === "Error"
    )
    if (error) throw new Error(error.value)
  })

  const removeControllerMessageId = await message({
    process: antAddress,
    signer: createDataItemSigner(window.arweaveWallet),
    tags: [
      { name: "Action", value: "Remove-Controller" },
      { name: "Controller", value: projectId },
    ],
  })

  const removeControllerResult = await result({
    message: removeControllerMessageId,
    process: antAddress,
  })

  removeControllerResult.Messages.forEach((message) => {
    const error = message.Tags.find(
      (tag: { name: string }) => tag.name === "Error"
    )
    if (error) throw new Error("Could not remove controller.")
  })
}

export const assignDomain = async (
  projectId: string,
  arnsDomain: string,
  environment: "production" | "preview",
  branch?: string
) => {
  const tags = [
    { name: "Action", value: "Assign-Domain-To-Environment" },
    { name: "ArnsDomain", value: arnsDomain },
    { name: "Environment", value: environment },
  ]

  if (branch) tags.push({ name: "Branch", value: branch })

  const messageId = await message({
    process: projectId,
    signer: createDataItemSigner(window.arweaveWallet),
    tags,
  })

  const addDomainResult = await result({
    message: messageId,
    process: projectId,
  })

  addDomainResult.Messages.forEach((message) => {
    const error = message.Tags.find(
      (tag: { name: string }) => tag.name === "Error"
    )
    if (error) throw new Error(error.value)
  })
}

export const removeDomain = async (
  projectId: string,
  environment: "production" | "preview",
  branch?: string
) => {
  const tags = [
    { name: "Action", value: "Remove-Domain-From-Environment" },
    { name: "Environment", value: environment },
  ]

  if (branch) tags.push({ name: "Branch", value: branch })

  const messageId = await message({
    process: projectId,
    signer: createDataItemSigner(window.arweaveWallet),
    tags,
  })

  const removeProductionDomainResult = await result({
    message: messageId,
    process: projectId,
  })

  removeProductionDomainResult.Messages.forEach((message) => {
    const error = message.Tags.find(
      (tag: { name: string }) => tag.name === "Error"
    )
    if (error) throw new Error(error.value)
  })
}

export const isControllerForAnt = async (
  address: string,
  antAddress: string
) => {
  const getControllersResponse = await dryrun({
    process: antAddress,
    tags: [{ name: "Action", value: "Controllers" }],
  })
  const controllers = JSON.parse(
    getControllersResponse.Messages[0].Data
  ) as string[]

  return controllers.includes(address)
}

export const addMember = async (
  projectId: string,
  name: string,
  address: string
) => {
  const messageId = await message({
    process: projectId,
    signer: createDataItemSigner(window.arweaveWallet),
    tags: [
      { name: "Action", value: "Add-Member" },
      { name: "MemberName", value: name },
      { name: "MemberAddress", value: address },
    ],
  })

  const addMemberResult = await result({
    message: messageId,
    process: projectId,
  })

  addMemberResult.Messages.forEach((message) => {
    const error = message.Tags.find(
      (tag: { name: string }) => tag.name === "Error"
    )
    if (error) throw new Error(error.value)
  })
}

export const removeMember = async (projectId: string, address: string) => {
  const messageId = await message({
    process: projectId,
    signer: createDataItemSigner(window.arweaveWallet),
    tags: [
      { name: "Action", value: "Remove-Member" },
      { name: "MemberAddress", value: address },
    ],
  })

  const removeMemberResult = await result({
    message: messageId,
    process: projectId,
  })

  removeMemberResult.Messages.forEach((message) => {
    const error = message.Tags.find(
      (tag: { name: string }) => tag.name === "Error"
    )
    if (error) throw new Error(error.value)
  })
}
