<script lang="ts">
  import "./style.css"
  import {
    A,
    Checkbox,
    Heading,
    Skeleton,
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
    Tooltip,
  } from "flowbite-svelte"
  import { AppState } from "./appState.svelte"
  import Navbar from "./components/navbar.svelte"

  const appState = new AppState()

  let showProduction = $state(true)
  let showPreview = $state(true)

  const filters = $derived.by(() => {
    const filters = []
    if (showProduction) filters.push("production")
    if (showPreview) filters.push("preview")
    return filters
  })

  const deployments = $derived.by(() =>
    appState.project.info?.Deployments.filter((deployment) =>
      filters.includes(deployment.Environment)
    ).sort((a, b) => b.CreatedAt - a.CreatedAt)
  )
</script>

<div class="container mx-auto">
  <Navbar {appState} />
  <Heading class="mb-4">Deployments</Heading>

  {#if !deployments}
    <Skeleton size="xxl" class="mt-8 mb-2.5" />
  {:else}
    <ul
      class="items-center w-full rounded-lg border border-gray-200 sm:flex dark:bg-gray-800 dark:border-gray-600 divide-x rtl:divide-x-reverse divide-gray-200 dark:divide-gray-600"
    >
      <li class="w-full">
        <Checkbox class="p-3 cursor-pointer" bind:checked={showProduction}>
          Show Production Deployments
        </Checkbox>
      </li>
      <li class="w-full">
        <Checkbox class="p-3 cursor-pointer" bind:checked={showPreview}
          >Show Preview Deployments</Checkbox
        >
      </li>
    </ul>
    <Table striped={true}>
      <TableHead>
        <TableHeadCell>Created At</TableHeadCell>
        <TableHeadCell>Environment</TableHeadCell>
        <TableHeadCell>Transaction ID</TableHeadCell>
        <TableHeadCell>Created By</TableHeadCell>
      </TableHead>
      <TableBody tableBodyClass="divide-y">
        {#each deployments as deployment}
          <TableBodyRow>
            <TableBodyCell>
              {new Date(deployment.CreatedAt).toLocaleString()}
            </TableBodyCell>
            <TableBodyCell>
              {deployment.Environment}
              {deployment.Environment === "preview"
                ? `(${deployment.Branch})`
                : ""}
            </TableBodyCell>
            <TableBodyCell>
              <A href={`https://ar-io.dev/${deployment.Id}`}>
                {deployment.Id}
              </A>
            </TableBodyCell>
            <TableBodyCell>
              {appState.utils.addressToName(deployment.CreatedBy)}
            </TableBodyCell>
            <Tooltip>{deployment.CreatedBy}</Tooltip>
          </TableBodyRow>
        {/each}
      </TableBody>
    </Table>
  {/if}
</div>
