<script lang="ts">
  import "./style.css"
  import {
    A,
    Button,
    ButtonGroup,
    Heading,
    Input,
    InputAddon,
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
  } from "flowbite-svelte"

  import { AppState } from "./appState.svelte"
  import Navbar from "./components/navbar.svelte"
  import { ArrowUpRightFromSquareOutline } from "flowbite-svelte-icons"

  const appState = new AppState()

  let memberName = $state("")
  let memberAddress = $state("")

  const addMember = async (e: Event) => {
    e.preventDefault()
    await appState.project.addMember(memberName, memberAddress)
    memberName = ""
    memberAddress = ""
  }
</script>

<div class="container mx-auto">
  <Navbar {appState} />
  <Heading class="mb-4">Members</Heading>
  <form onsubmit={addMember}>
    <ButtonGroup class="my-4 w-full">
      <InputAddon class="whitespace-nowrap font-semibold">Member</InputAddon>
      <Input bind:value={memberName} placeholder="Name" required />
      <Input bind:value={memberAddress} placeholder="Address" required />
      <Button
        type="submit"
        class="w-full"
        color="primary"
        disabled={appState.loading}
      >
        Add Member
      </Button>
    </ButtonGroup>
  </form>

  {#if appState.project.info}
    {@const memberList = appState.project.info.Members}
    <Table hoverable>
      <TableHead>
        <TableHeadCell>Name</TableHeadCell>
        <TableHeadCell>Address</TableHeadCell>
        <TableHeadCell>Actions</TableHeadCell>
      </TableHead>
      <TableBody>
        {#each memberList as member}
          <TableBodyRow>
            <TableBodyCell>{member.Name}</TableBodyCell>
            <TableBodyCell>
              <A
                href="https://www.ao.link/#/entity/{member.Address}"
                target="_blank"
              >
                {member.Address}&nbsp;
                <ArrowUpRightFromSquareOutline size="sm" />
              </A>
            </TableBodyCell>
            <TableBodyCell>
              <Button
                onclick={() => appState.project.removeMember(member.Address)}
                class="w-full"
                size="xs"
                color="red">Remove</Button
              >
            </TableBodyCell>
          </TableBodyRow>
        {/each}
      </TableBody>
    </Table>
  {/if}
</div>
