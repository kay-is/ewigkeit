<script lang="ts">
  import NavBar from '$lib/components/navbar.svelte'
  import Tabs from '$lib/components/tabs.svelte'

  const { data } = $props()
  const deployments = data.Deployments.reverse()

  const getMemberName = (address: string) => {
    console.log(data.Members)
    console.log(address)
    const member = data.Members.find((member) => member.Address === address)
    return member ? member.Name : 'Unknown'
  }
</script>

<svelte:head>
  <title>Ewigkeit | Deployments ({data.Deployments.length})</title>
</svelte:head>

<NavBar projectName={data.Name} projectId={data.Id} />
<Tabs activeTab="deployments" />

<h1 class="text-3xl font-bold pt-5">Deployments</h1>

{#if data.Deployments.length === 0}
  <p>This project doesn't have any deployments yet.</p>
{:else}
  <div class="overflow-x-auto">
    <table class="table table-zebra">
      <thead>
        <tr>
          <th>Created At</th>
          <th>Environment</th>
          <th>Active</th>
          <th>Deployment ID</th>
          <th>Created By</th>
        </tr>
      </thead>
      <tbody>
        {#each deployments as deployment}
          <tr>
            <td>{new Date(deployment.CreatedAt).toLocaleString()}</td>
            <td>
              {deployment.Environment === 'preview'
                ? `${deployment.Environment} (${deployment.Branch})`
                : deployment.Environment}
            </td>
            <td>
              {#if data.ActiveDeployments.production === deployment.Id}
                <span class="text-green-500">Yes</span>
              {:else if data.ActiveDeployments.preview[deployment.Branch] === deployment.Id}
                <span class="text-green-500">Yes</span>
              {:else}
                <span class="text-red-500">No</span>
              {/if}
            </td>
            <td
              ><a class="underline" target="_blank" href={`https://ar-io.dev/${deployment.Id}`}>
                {deployment.Id}
              </a>
            </td>
            <td>{getMemberName(deployment.CreatedBy)}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}
