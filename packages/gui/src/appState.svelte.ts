import { dryrun } from "@permaweb/aoconnect"
import {
  addAnt,
  addMember,
  assignDomain,
  removeAnt,
  removeDomain,
  removeMember,
} from "./project"

export type GuiState = {
  error: string
}

export type Deployment =
  | {
      Id: string
      Environment: "production"
      CreatedAt: number
      CreatedBy: string
    }
  | {
      Id: string
      Environment: "preview"
      Branch: string
      CreatedAt: number
      CreatedBy: string
    }

export type Member = {
  Name: string
  Address: string
}

export type Domains = {
  production: string
  preview: Record<string, string>
}

export type Ants = Record<string, string>

export interface ProjectInfo {
  Name: string
  Description: string
  Id: string
  Ants: Ants
  Members: Member[]
  Domains: Domains
  Deployments: Deployment[]
  DeploymentHashes: Record<string, string>
  ActiveDeployments: { production: string; preview: Record<string, string> }
}

export type ProjectState = {
  id: string
  info?: ProjectInfo
}

export type WalletState = {
  address?: string
  name?: string
  connected: Boolean
}

export interface WalletStateWithMethods extends WalletState {
  connect: () => Promise<void>
  disconnect: () => Promise<void>
}

/**
 * This class keeps project and wallet information synchronized in Svelte runes.
 *
 * A change of the project ID in the URL hash will trigger a reload of the
 * project info.
 *
 * A connect, disconnect, and switch of the wallet will trigger a reload of the
 * wallet info.
 *
 * It also stores the project and wallet state in sessionStorage so ensure
 * state is preserved between pages.
 */
export class AppState {
  #loading = $state(false)
  #error = $state("")

  #project: ProjectState = $state({
    id: "",
    info: undefined,
  })

  #wallet: WalletState = $state({
    connected: false,
    address: "",
  })

  #sessionStorageKeys = {
    wallet: "appState.wallet",
    project: "appState.project",
  }

  constructor() {
    const wallet = sessionStorage.getItem(this.#sessionStorageKeys.wallet)
    if (wallet) this.#wallet = JSON.parse(wallet)

    const project = sessionStorage.getItem(this.#sessionStorageKeys.project)
    if (project) this.#project = JSON.parse(project)

    this.#updateProject()

    window.addEventListener("arweaveWalletLoaded", this.#updateWallet)
    window.addEventListener("hashchange", this.#updateProject)
    window.addEventListener("walletSwitch", this.#updateWallet)
  }

  get loading() {
    return this.#loading
  }

  get error() {
    return this.#error
  }

  get project() {
    return {
      ...this.#project,
      refresh: this.#loadProjectInfo,
      addAnt: async (arnsDomain: string) => {
        this.#loading = true
        if (this.#project.info)
          this.#project.info.Ants[arnsDomain] = "Connecting ANT process..."
        await addAnt(this.#project.id, arnsDomain)
        await this.#updateProject()
      },
      removeAnt: async (arnsDomain: string, antAddress: string) => {
        this.#loading = true
        delete this.#project.info?.Ants[arnsDomain]
        await removeAnt(this.#project.id, arnsDomain, antAddress)
        await this.#updateProject()
      },
      assignDomain: async (
        domain: string,
        environment: "production" | "preview",
        branch?: string
      ) => {
        this.#loading = true
        if (this.#project.info) {
          if (environment === "production") {
            this.#project.info.Domains.production = "Assigning domain..."
          } else {
            this.#project.info.Domains.preview[branch ?? ""] =
              "Assigning domain..."
          }
        }
        await assignDomain(this.#project.id, domain, environment, branch)
        await this.#updateProject()
      },
      removeDomain: async (
        environment: "production" | "preview",
        branch?: string
      ) => {
        this.#loading = true
        if (this.#project.info) {
          if (environment === "production") {
            this.#project.info.Domains.production = "Removing domain..."
          } else {
            this.#project.info.Domains.preview[branch ?? ""] =
              "Removing domain..."
          }
        }
        await removeDomain(this.#project.id, environment, branch)
        await this.#updateProject()
      },
      addMember: async (name: string, address: string) => {
        this.#loading = true
        if (this.#project.info)
          this.#project.info.Members.push({
            Name: name,
            Address: "Adding member...",
          })
        await addMember(this.#project.id, name, address)
        await this.#updateProject()
      },
      removeMember: async (address: string) => {
        this.#loading = true
        if (this.#project.info) {
          this.#project.info.Members = this.#project.info.Members.filter(
            (member) => member.Address !== address
          )
        }
        await removeMember(this.#project.id, address)
        await this.#updateProject()
      },
    }
  }

  get wallet() {
    return {
      ...this.#wallet,
      connect: this.#connectWallet,
      disconnect: this.#disconnectWallet,
    }
  }

  get utils() {
    return {
      addressToName: (address: string) => {
        if (!this.#project.info) return address
        const member = this.#project.info.Members.find(
          (member) => member.Address === address
        )
        return member?.Name ?? address
      },
    }
  }

  #connectWallet = async () => {
    await window.arweaveWallet.connect([
      "ACCESS_ADDRESS",
      "ACCESS_ALL_ADDRESSES",
      "SIGNATURE",
      "SIGN_TRANSACTION",
    ])

    await this.#updateWallet()
  }

  #disconnectWallet = async () => {
    await window.arweaveWallet.disconnect()
    await this.#updateWallet()
  }

  #updateWallet = async () => {
    this.#loading = true
    try {
      const walletAddress = await window.arweaveWallet.getActiveAddress()
      this.#wallet.address = walletAddress
      this.#wallet.connected = true

      const walletNames = await window.arweaveWallet.getWalletNames()
      this.#wallet.name = walletNames[walletAddress]
    } catch (e) {
      this.#wallet.address = ""
      this.#wallet.name = ""
      this.#wallet.connected = false
    }
    sessionStorage.setItem(
      this.#sessionStorageKeys.wallet,
      JSON.stringify(this.#wallet)
    )
    this.#loading = false
  }

  #updateProject = async () => {
    this.#project.id = window.location.hash.slice(1)
    await this.#loadProjectInfo()
  }

  #loadProjectInfo = async () => {
    if (!this.#project.id) return

    this.#loading = true

    const result = await dryrun({
      process: this.#project.id,
      tags: [{ name: "Action", value: "Info" }],
    })

    if ("error" in result) {
      this.#error =
        "error" in result ? (result.error as string) : "Unknown error"
      this.#loading = false
      return
    }

    const response = result.Messages[0]

    this.#project.info = JSON.parse(response.Data)
    console.info(this.#project.info)
    sessionStorage.setItem(
      this.#sessionStorageKeys.project,
      JSON.stringify(this.#project)
    )
    this.#error = ""
    this.#loading = false
  }
}
