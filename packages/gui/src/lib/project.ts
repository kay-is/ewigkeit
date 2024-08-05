import * as Ao from '$lib/ao'

export type Deployment =
  | {
      Id: string
      Environment: 'production'
      CreatedAt: number
      CreatedBy: string
    }
  | {
      Id: string
      Environment: 'preview'
      Branch: string
      CreatedAt: number
      CreatedBy: string
    }

export type Member = {
  Name: string
  Address: string
}

export interface ProjectInfo {
  Name: string
  Description: string
  Id: string
  Ants: Record<string, string>
  Members: Member[]
  Domains: {
    production: string
    preview: Record<string, string>
  }
  Deployments: Deployment[]
  DeploymentHashes: Record<string, string>
  ActiveDeployments: { production: string; preview: Record<string, string> }
}

export async function create(projectName: string) {
  const processCode = await fetch('/project.lua').then((res) => res.text())

  const codeWithProjectValues = processCode
    .replaceAll('<NAME>', projectName)
    .replaceAll('<TICKER>', 'ATOMIC')
    .replaceAll('<DENOMINATION>', '1')
    .replaceAll('<BALANCE>', '1')

  return await Ao.spawn(codeWithProjectValues, { Application: 'Ewigkeit', Name: projectName })
}

export async function loadInfo(projectId: string) {
  const info = await Ao.read<ProjectInfo>(projectId, 'Info')
  console.log('Project info', info)
  return info
}
