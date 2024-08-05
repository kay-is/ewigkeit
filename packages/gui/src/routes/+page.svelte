<script lang="ts">
  import * as Navigation from '$app/navigation'
  import * as Project from '$lib/project'
  import * as Wallet from '$lib/wallet'

  import Loading from '$lib/components/loading.svelte'

  const { data } = $props()

  let loading = $state('')
  let projectName = $state('')

  const createProject = async () => {
    loading = 'Creating project...'
    const projectId = await Project.create(projectName)
    Navigation.goto(`/project/${projectId}/overview`)
  }
</script>

<div class="hero bg-base-200 min-h-screen">
  <div class="hero-content text-center">
    <div class="max-w-md">
      <h1 class="text-5xl font-bold">Ewigkeit</h1>
      <p class="py-6">Deploy DApps to the Permaweb.</p>
      {#if !data.address}
        <button class="btn btn-primary btn-wide" onclick={Wallet.connect}>Connect Wallet</button>
      {:else}
        <div class="join py-5">
          <input
            class="input input-bordered w-full"
            oninput={(e) => (projectName = e.currentTarget.value)}
            placeholder="Project Name"
            value={projectName}
          />
          <button class="btn btn-primary" onclick={createProject}>Create Project</button>
        </div>

        <p class="py-6">Connected with "{data.arnsDomain}"<br />({data.address})</p>

        <button class="btn btn-neutral btn-wide" onclick={Wallet.disconnect}>
          Disconnect Wallet
        </button>
      {/if}
    </div>
  </div>
</div>

<Loading {loading} />
