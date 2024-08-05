import * as Project from '$lib/project'

export async function load({ params }) {
  return Project.loadInfo(params.projectId)
}
