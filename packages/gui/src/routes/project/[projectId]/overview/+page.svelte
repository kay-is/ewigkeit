<script lang="ts">
  import NavBar from '$lib/components/navbar.svelte'
  import Tabs from '$lib/components/tabs.svelte'

  const { data } = $props()
</script>

<svelte:head>
  <title>Ewigkeit | Overview</title>
</svelte:head>

<NavBar projectName={data.Name} projectId={data.Id} />
<Tabs activeTab="overview" />

<h1 class="text-3xl font-bold pt-5">{data.Name}</h1>
<p class="text-xl">{data.Description}</p>
<p>Project ID: {data.Id}</p>
<br />
{#if data.Deployments.length === 0}
  <p>This project doesn't have any deployments yet.</p>
{:else}
  <p>Latest Deployment:</p>
  <p>ID: {data.Deployments[0].Id}</p>
  <p>Date: {new Date(data.Deployments[0].CreatedAt).toLocaleString()}</p>
  <p>Environment: {data.Deployments[0].Environment}</p>
  <p>Deployer: {data.Deployments[0].CreatedBy}</p>
{/if}
<br />
<p>Link a project directory to this project with the following command:</p>

<pre><code>
  ewig link {data.Id}
</code></pre>
