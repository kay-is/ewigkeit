<script lang="ts">
  import * as ArioSdk from '@ar.io/sdk/web'
  import * as Navigation from '$app/navigation'
  import * as Ao from '$lib/ao'

  import NavBar from '$lib/components/navbar.svelte'
  import Tabs from '$lib/components/tabs.svelte'
  import Loading from '$lib/components/loading.svelte'

  const { data } = $props()

  const getEnvironment = (arnsDomain: string) => {
    if (data.Domains.production === arnsDomain) return 'production'

    for (let previewEnvironment of Object.entries(data.Domains.preview))
      if (previewEnvironment[1] === arnsDomain) return `preview (${previewEnvironment[0]})`

    return 'none'
  }

  let loading = $state('')
  let error = $state('')
  let arnsDomain = $state('')
  const addAnt = async () => {
    error = ''
    loading = 'Adding ArNS domain to project...'
    const io = ArioSdk.IO.init()
    const arnsRecord = await io.getArNSRecord({ name: arnsDomain })

    if (!arnsRecord) {
      error = 'ArNS domain not found.'
      loading = ''
      return
    }

    await Ao.send(data.Id, 'Add-Ant', {
      ArnsDomain: arnsDomain,
      AntAddress: arnsRecord.processId,
    })
    await Navigation.invalidateAll()
    arnsDomain = ''
    loading = ''
  }

  const removeAnt = (arnsDomain: string) => async () => {
    loading = 'Removing ArNS domain from project...'
    await Ao.send(data.Id, 'Remove-Ant', { ArnsDomain: arnsDomain })
    await Navigation.invalidateAll()
    loading = ''
  }

  let productionDomain = $state(data.Domains.production)
  const assignProductionDomain = async () => {
    loading = 'Assigning domain to production environment...'
    await Ao.send(data.Id, 'Assign-Domain-To-Environment', {
      Environment: 'production',
      ArnsDomain: productionDomain,
    })
    await Navigation.invalidateAll()
    loading = ''
  }

  let previewDomain = $state('')
  let previewBranch = $state('')
  const assignPreviewDomain = async () => {
    loading = 'Assigning domain to preview environment...'
    await Ao.send(data.Id, 'Assign-Domain-To-Environment', {
      Environment: 'preview',
      ArnsDomain: previewDomain,
      Branch: previewBranch,
    })
    await Navigation.invalidateAll()
    loading = ''
  }

  const removePreviewDomain = (arnsDomain: string, branch: string) => async () => {
    loading = 'Removing domain from preview environment...'
    await Ao.send(data.Id, 'Remove-Domain-From-Environment', {
      Environment: 'preview',
      ArnsDomain: arnsDomain,
      Branch: branch,
    })
    await Navigation.invalidateAll()
    loading = ''
  }
</script>

<svelte:head>
  <title>Ewigkeit | Domains ({Object.keys(data.Ants).length})</title>
</svelte:head>

<NavBar projectName={data.Name} projectId={data.Id} />
<Tabs activeTab="domains" />

<h2 class="py-5 text-2xl font-bold">Environments</h2>
<p>Manage ArNS domains for each environment.</p>
<br />
<p>
  If a new deployment is added, the CLI will automatically check the environment of the deployment
  and add the corresponding ArNS domain.
</p>

<h3 class="py-5 text-xl font-bold">Production</h3>

{#if data.Domains.production === ''}
  <p>No active production domain.</p>
{:else}
  <p>
    Active production domain: <a
      target="_blank"
      class="underline"
      href={`https://${data.Domains.production}.ar-io.dev`}>{data.Domains.production}</a
    >
  </p>
{/if}

<div class="join pt-5">
  <select
    class="select select-bordered"
    value={productionDomain}
    onchange={(e) => (productionDomain = e.currentTarget.value)}
  >
    <option value="">No Domain</option>
    {#each Object.keys(data.Ants) as arnsDomain}
      <option value={arnsDomain}>{arnsDomain}</option>
    {/each}
  </select>
  <button
    class="btn btn-outline"
    onclick={assignProductionDomain}
    disabled={productionDomain === data.Domains.production}
  >
    Assign Domain
  </button>
</div>

<h3 class="py-5 text-xl font-bold">Preview</h3>

{#if Object.keys(data.Domains.preview).length === 0}
  <p>No active preview domains.</p>
{:else}
  <p>Active preview domains:</p>
  <ul class="list-disc pl-5 pt-5">
    {#each Object.entries(data.Domains.preview) as [branch, arnsDomain]}
      <li>
        <a target="_blank" class="underline" href={`https://${arnsDomain}.ar-io.dev`}
          >{arnsDomain}</a
        >
        (Branch: {branch})
        <button
          class="btn btn-outline btn-error btn-sm"
          onclick={removePreviewDomain(arnsDomain, branch)}>Remove</button
        >
      </li>
    {/each}
  </ul>
{/if}

<div class="join pt-5">
  <input
    class="input input-bordered"
    placeholder="ArNS Domain"
    value={previewDomain}
    onchange={(e) => (previewDomain = e.currentTarget.value)}
  />
  <input
    class="input input-bordered"
    placeholder="Git Branch"
    value={previewBranch}
    oninput={(e) => (previewBranch = e.currentTarget.value)}
  />
  <button class="btn btn-outline" onclick={assignPreviewDomain} disabled={!previewBranch}
    >Assign Domain</button
  >
</div>

<h2 class="py-5 text-2xl font-bold">ArNS Domains</h2>
<p>Manage ArNS domains associated with this project.</p>
<br />
<p>Note: Add the project ID as controller to your ArNS domain before adding it to the project.</p>

<div class="join py-5">
  <input
    class="input input-bordered w-full"
    oninput={(e) => (arnsDomain = e.currentTarget.value)}
    value={arnsDomain}
    placeholder="ArNS Domain"
  />
  <button class="btn btn-outline" onclick={addAnt} disabled={!arnsDomain}>Add Domain</button>
</div>
{#if Object.keys(data.Ants).length === 0}
  <p>No ArNS domains associated with this project.</p>
{:else}
  <div class="overflow-x-auto">
    <table class="table table-zebra">
      <thead>
        <tr>
          <th>ArNS Domain</th>
          <th>Environment</th>
          <th>ANT Address</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each Object.entries(data.Ants) as [arnsDomain, antAddress]}
          <tr class="hover">
            <td>{arnsDomain}</td>
            <td>{getEnvironment(arnsDomain)}</td>
            <td>{antAddress}</td>
            <td>
              <div class="join w-full">
                <a
                  target="_blank"
                  class="btn btn-outline btn-info btn-sm"
                  href={`https://arns.app/#/manage/ants/${antAddress}`}>Info</a
                >
                <button class="btn btn-outline btn-error btn-sm" onclick={removeAnt(arnsDomain)}
                  >Remove</button
                >
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}

{#if error}
  <div class="toast">
    <div class="alert alert-error">
      <span>{error}</span>
    </div>
  </div>
{/if}

<Loading {loading} />
