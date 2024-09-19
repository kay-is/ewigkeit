<script lang="ts">
  import "./style.css"
  import { Section } from "flowbite-svelte-blocks"
  import {
    Button,
    Heading,
    Label,
    Input,
    Textarea,
    P,
    Tooltip,
    Spinner,
  } from "flowbite-svelte"
  import { AppState } from "./appState.svelte"
  import { createProject } from "./project"
  import Navbar from "./components/navbar.svelte"

  const appState = new AppState()

  const newProject = $state({
    name: "",
    description: "",
    ticker: "ATOMIC",
    denomination: 1,
  })

  let loading = $state(false)
  const handleSubmission = async (e: Event) => {
    e.preventDefault()
    loading = true
    const projectId = await createProject(newProject)
    window.location.href = "./#" + projectId
    loading = false
  }
</script>

<div class="container mx-auto">
  <Navbar {appState} />

  <Section name="crudcreateform">
    <Heading class="mb-4 text-2xl">New Project</Heading>
    <P class="mb-4">
      Create a new project to handle the deployments and domains for your DApp.
      The project will become a process on AO and an Atomic Asset.
    </P>
    <form onsubmit={handleSubmission}>
      <Heading class="mb-2 text-base">Base Information</Heading>
      <div class="grid gap-4 sm:grid-cols-2 sm:gap-6 mb-4">
        <div class="sm:col-span-2">
          <Label for="name" class="mb-2">Name</Label>
          <Input
            required
            id="name"
            bind:value={newProject.name}
            disabled={loading}
          />
        </div>
        <div class="sm:col-span-2">
          <Label for="name" class="mb-2">Description</Label>
          <Textarea
            id="description"
            bind:value={newProject.description}
            disabled={loading}
          />
        </div>
      </div>
      <Heading class="mb-2 text-base">Atomic Asset</Heading>
      <div class="grid gap-4 sm:grid-cols-4 sm:gap-6 mb-7">
        <div class="col-span-3">
          <Label for="ticker" class="mb-2">Ticker</Label>
          <Input
            required
            id="ticker"
            bind:value={newProject.ticker}
            disabled={loading}
          />
        </div>
        <div class="col-span-1">
          <Label for="denominator" class="mb-2">Denomination</Label>
          <Input
            required
            type="number"
            id="denomination"
            bind:value={newProject.denomination}
            disabled={loading}
          />
        </div>
      </div>

      <Button
        type="submit"
        class="w-full relative"
        disabled={!appState.wallet.connected || loading}
      >
        {#if loading}
          <Spinner size={4} />&nbsp;Creating project...
        {:else}
          Create New Project
        {/if}
      </Button>
      {#if !appState.wallet.connected}
        <Tooltip>Connect your wallet to create a project.</Tooltip>
      {/if}
    </form>
  </Section>
</div>
