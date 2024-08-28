<script lang="ts">
  import { Button, Heading } from "flowbite-svelte"
  import type { AppState } from "../appState.svelte"
  import Navbar from "./navbar.svelte"

  const { appState }: { appState: AppState } = $props()
</script>

{#if appState.project.id}{:else}{/if}
<div class="container mx-auto">
  <Navbar {appState} />

  <div class="text-center">
    <Heading tag="h1" class="mt-20 mb-5">Ewigkeit</Heading>
    <Heading tag="h2" class="mb-5">Deploy DApps to the Permaweb</Heading>
    <Heading tag="h4" class="mb-10">Pay once, host forever.</Heading>
    <Button size="lg" href="/new">Get Started</Button>
    <Button size="lg" href="/" color="alternative" class="ml-5"
      >Learn More</Button
    >
  </div>
</div>
