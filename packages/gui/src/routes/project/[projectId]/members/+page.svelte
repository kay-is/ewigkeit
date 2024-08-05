<script lang="ts">
  import * as Navigation from '$app/navigation'
  import * as Ao from '$lib/ao'

  import Loading from '$lib/components/loading.svelte'
  import NavBar from '$lib/components/navbar.svelte'
  import Tabs from '$lib/components/tabs.svelte'

  const { data } = $props()

  let loading = $state('')
  let memberAddress = $state('')
  let memberName = $state('')

  const addMember = async () => {
    loading = 'Adding member to project...'
    await Ao.send(data.Id, 'Add-Member', { MemberName: memberName, MemberAddress: memberAddress })
    await Navigation.invalidateAll()
    memberAddress = ''
    memberName = ''
    loading = ''
  }

  const removeMember = (address: string) => async () => {
    loading = 'Removing member from project...'
    await Ao.send(data.Id, 'Remove-Member', { MemberAddress: address })
    await Navigation.invalidateAll()
    loading = ''
  }
</script>

<svelte:head>
  <title>Ewigkeit | Members ({data.Members.length})</title>
</svelte:head>

<NavBar projectName={data.Name} projectId={data.Id} />
<Tabs activeTab="members" />

<h2 class="py-5 text-2xl font-bold">Members</h2>
<p>The Arweave wallet addresses that are allowed to modify the project and add deployments.</p>

<h3 class="py-5 text-xl font-bold">Project Members</h3>
<div class="join pb-5">
  <input
    class="input input-bordered w-full"
    oninput={(e) => (memberName = e.currentTarget.value)}
    placeholder="Name"
  />
  <input
    class="input input-bordered w-full"
    oninput={(e) => (memberAddress = e.currentTarget.value)}
    placeholder="Arweave Address"
  />
  <button class="btn btn-primary" onclick={addMember} disabled={!memberAddress || !memberName}
    >Add Member</button
  >
</div>

{#if data.Members.length === 0}
  <p>This project doesn't have any members, just an owner.</p>
{:else}
  <div class="overflow-x-auto">
    <table class="table table-zebra">
      <thead>
        <tr>
          <th>Name</th>
          <th>Address</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {#each data.Members as member}
          <tr>
            <td>{member.Name}</td>
            <td>{member.Address}</td>
            <td>
              <button class="btn btn-sm btn-error" onclick={removeMember(member.Address)}>
                Remove
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}

<Loading {loading} />
