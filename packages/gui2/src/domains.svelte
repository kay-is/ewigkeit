<script lang="ts">
  import "./style.css"
  import {
    A,
    Button,
    ButtonGroup,
    Heading,
    Input,
    InputAddon,
    Skeleton,
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
  } from "flowbite-svelte"

  import { ArrowUpRightFromSquareOutline } from "flowbite-svelte-icons"

  import { AppState } from "./appState.svelte"
  import Navbar from "./components/navbar.svelte"
  import ProductionDomainModal, {
    type ProductionDomainUpdate,
  } from "./components/productionDomainModal.svelte"
  import PreviewDomainModal, {
    type PreviewDomainUpdate,
  } from "./components/previewDomainModal.svelte"

  const appState = new AppState()

  // ----- ANT Functions

  let arnsDomain = $state("")
  const addAnt = async (e: Event) => {
    e.preventDefault()
    await appState.project.addAnt(arnsDomain)
    arnsDomain = ""
  }

  const removeAnt = (arnsDomain: string, antAddress: string) => async () => {
    if (!confirm("Are you sure?")) return
    await appState.project.removeAnt(arnsDomain, antAddress)
  }

  // ----- Domain Modal Functions

  let productionDomainModalIsOpen = $state(false)

  let previewDomainModalIsOpen = $state(false)
  let selectedBranch = $state("")
  let selectedDomain = $state("")
  const showAddPreviewDomainModal = () => {
    selectedBranch = ""
    selectedDomain = ""
    previewDomainModalIsOpen = true
  }
  const showEditPreviewDomainModal = (branch: string) => () => {
    selectedBranch = branch
    selectedDomain = appState.project.info?.Domains.preview[branch] ?? ""
    previewDomainModalIsOpen = true
  }

  // ----- Domain Update Functions

  const setProductionDomain = async (domainUpdate: ProductionDomainUpdate) => {
    await appState.project.assignDomain(domainUpdate.arnsDomain, "production")
    console.warn("TODO: Update active deployment domain.")
  }

  const setPreviewDomain = async (domainUpdate: PreviewDomainUpdate) => {
    await appState.project.assignDomain(
      domainUpdate.arnsDomain,
      "preview",
      domainUpdate.branch
    )
    console.warn("TODO: Update active deployment domain.")
  }

  const removeDomain =
    (environment: "production" | "preview", branch?: string) => async () => {
      if (!confirm("Are you sure?")) return
      await appState.project.removeDomain(environment, branch)
    }
</script>

{#if appState.project.info}
  {#key productionDomainModalIsOpen}
    <ProductionDomainModal
      bind:open={productionDomainModalIsOpen}
      ants={appState.project.info.Ants}
      domains={appState.project.info.Domains}
      onSubmit={setProductionDomain}
    />
  {/key}

  {#key previewDomainModalIsOpen}
    <PreviewDomainModal
      bind:open={previewDomainModalIsOpen}
      branch={selectedBranch}
      arnsDomain={selectedDomain}
      ants={appState.project.info.Ants}
      onSubmit={setPreviewDomain}
    />
  {/key}
{/if}

<div class="container mx-auto">
  <Navbar {appState} />
  <Heading class="mb-4">Domains</Heading>

  <Heading tag="h2" class="my-4 mt-10">Assigned ArNS Domains</Heading>

  <ButtonGroup class="w-full my-4">
    <Button
      class="w-full"
      color="primary"
      onclick={() => (productionDomainModalIsOpen = true)}
    >
      Set Production Domain
    </Button>
    <Button class="w-full" color="primary" onclick={showAddPreviewDomainModal}>
      Add Preview Domain
    </Button>
  </ButtonGroup>

  {#if !appState.project.info}
    <Skeleton />
  {:else}
    <Table hoverable>
      <TableHead>
        <TableHeadCell>Environment</TableHeadCell>
        <TableHeadCell>ArNS Domain</TableHeadCell>
        <TableHeadCell>Active Deployment ID</TableHeadCell>
        <TableHeadCell>Actions</TableHeadCell>
      </TableHead>
      <TableBody tableBodyClass="divide-y">
        {#if appState.project.info?.Domains.production}
          {@const productionDomain = appState.project.info?.Domains.production}
          {@const activeDeployment =
            appState.project.info.ActiveDeployments.production}
          <TableBodyRow>
            <TableBodyCell>Production</TableBodyCell>
            <TableBodyCell>
              <A href={`https://${productionDomain}.ar.io/`}>
                {productionDomain}&nbsp;
                <ArrowUpRightFromSquareOutline size="sm" />
              </A>
            </TableBodyCell>
            <TableBodyCell>
              <A href={`https://g8way.io/${activeDeployment}`}>
                {activeDeployment}&nbsp;
                <ArrowUpRightFromSquareOutline size="sm" />
              </A>
            </TableBodyCell>
            <TableBodyCell>
              <ButtonGroup class="w-full">
                <Button
                  class="w-full"
                  size="xs"
                  color="primary"
                  onclick={() => (productionDomainModalIsOpen = true)}
                >
                  Edit
                </Button>
                <Button
                  class="w-full"
                  size="xs"
                  color="red"
                  onclick={removeDomain("production")}>Remove</Button
                >
              </ButtonGroup>
            </TableBodyCell>
          </TableBodyRow>
        {/if}
        {@const previewDomains = Object.entries(
          appState.project.info.Domains.preview
        )}
        {#if previewDomains.length > 0}
          {#each previewDomains as [branch, domain]}
            {@const activeDeployment =
              appState.project.info.ActiveDeployments.preview[branch]}
            <TableBodyRow>
              <TableBodyCell>Preview ({branch})</TableBodyCell>
              <TableBodyCell>
                <A href={`https://${domain}.ar.io/`}>
                  {domain}&nbsp;
                  <ArrowUpRightFromSquareOutline size="sm" />
                </A>
              </TableBodyCell>
              <TableBodyCell>
                <A href={`https://g8way.io/${activeDeployment}`}>
                  {activeDeployment}&nbsp;
                  <ArrowUpRightFromSquareOutline size="sm" />
                </A>
              </TableBodyCell>
              <TableBodyCell>
                <ButtonGroup class="w-full">
                  <Button
                    class="w-full"
                    size="xs"
                    color="primary"
                    onclick={showEditPreviewDomainModal(branch)}
                  >
                    Edit
                  </Button>
                  <Button
                    class="w-full"
                    size="xs"
                    color="red"
                    onclick={removeDomain("preview", branch)}
                  >
                    Remove
                  </Button>
                </ButtonGroup>
              </TableBodyCell>
            </TableBodyRow>
          {/each}
        {/if}
      </TableBody>
    </Table>
  {/if}
  <Heading tag="h2" class="my-4 mt-10">Connected ANT Processes</Heading>

  <ButtonGroup class="my-4 w-full">
    <InputAddon class="whitespace-nowrap font-semibold">ArNS Domain</InputAddon>
    <Input bind:value={arnsDomain} />
    <Button
      class="w-full"
      color="primary"
      onclick={addAnt}
      disabled={appState.loading}
    >
      Connect ANT
    </Button>
  </ButtonGroup>
  {#if appState.project.info}
    {@const antList = Object.entries(appState.project.info.Ants)}
    <Table hoverable>
      <TableHead>
        <TableHeadCell>ArNS Domain</TableHeadCell>
        <TableHeadCell>ANT Process ID</TableHeadCell>
        <TableHeadCell>Actions</TableHeadCell>
      </TableHead>
      <TableBody>
        {#each antList as [domain, address]}
          <TableBodyRow>
            <TableBodyCell>{domain}</TableBodyCell>
            <TableBodyCell>
              <A
                href={`https://www.ao.link/#/entity/${address}`}
                target="_blank"
              >
                {address}&nbsp;
                <ArrowUpRightFromSquareOutline size="sm" />
              </A>
            </TableBodyCell>
            <TableBodyCell>
              <ButtonGroup class="w-full">
                <Button
                  href={`https://arns.app/#/manage/names/${domain}`}
                  target="_blank"
                  class="w-full"
                  size="xs"
                  color="light"
                >
                  Manage&nbsp;
                  <ArrowUpRightFromSquareOutline size="sm" />
                </Button>
                <Button
                  onclick={removeAnt(domain, address)}
                  class="w-full"
                  size="xs"
                  color="red">Remove</Button
                >
              </ButtonGroup>
            </TableBodyCell>
          </TableBodyRow>
        {/each}
      </TableBody>
    </Table>
  {/if}
</div>
