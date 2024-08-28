<script lang="ts">
  import {
    ButtonGroup,
    DarkMode,
    Input,
    InputAddon,
    Navbar,
    NavBrand,
    NavHamburger,
    NavLi,
    NavUl,
    Popover,
    Spinner,
  } from "flowbite-svelte"
  import Wallet from "./wallet.svelte"
  import type { AppState } from "src/appState.svelte"

  const { appState }: { appState: AppState } = $props()
  const projectName = $derived(
    appState.project.info ? appState.project.info.Name : "..."
  )
</script>

<Navbar fluid={false}>
  <NavBrand href="/">
    <span class="text-xl font-bold">Ewigkeit</span>
  </NavBrand>
  {#if !!appState.project.id}
    <div class="flex items-center">
      <ButtonGroup id="project-group">
        <InputAddon class="font-semibold">Project</InputAddon>
        <Input
          class="rounded-none rounded-r-lg font-mono disabled:cursor-default"
          placeholder="Select Project"
          value={projectName}
          disabled
        />
      </ButtonGroup>

      <Popover triggeredBy="#project-group" class="font-mono">
        {appState.project.id}
      </Popover>
    </div>
    <NavHamburger />
    <NavUl>
      <NavLi href={"/#" + appState.project.id}>Overview</NavLi>
      <NavLi href={"/deployments#" + appState.project.id}>Deployments</NavLi>
      <NavLi href={"/domains#" + appState.project.id}>Domains</NavLi>
      <NavLi href={"/members#" + appState.project.id}>Members</NavLi>
    </NavUl>
  {/if}
  <div class="flex items-center lg:order-2">
    <Wallet wallet={appState.wallet} />
    <DarkMode class="ml-5" />
    {#if appState.loading}
      <Spinner size={6} color="gray" />
    {:else}
      <div style="width: 24px; height: 24px"></div>
    {/if}
  </div>
</Navbar>
