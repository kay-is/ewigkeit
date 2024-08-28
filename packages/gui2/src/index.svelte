<script lang="ts">
  import "./style.css"
  import { A, Heading, P, Skeleton } from "flowbite-svelte"
  import { AppState } from "./appState.svelte"
  import LandingPage from "./components/landing.page.svelte"
  import Navbar from "./components/navbar.svelte"

  const appState = new AppState()

  const addressToName = (address: string) => {
    if (!appState.project.info) return address

    const member = appState.project.info.Members.find(
      (member) => member.Address === address
    )

    return member?.Name ?? address
  }
</script>

{#if appState.project.id}
  <div class="container mx-auto">
    <Navbar {appState} />

    {#if !appState.project.info}
      <Skeleton size="xxl" class="mt-8 mb-2.5" />
    {:else}
      <Heading class="mb-4">{appState.project.info.Name}</Heading>
      <P class="mb-4">{appState.project.info.Description}</P>

      <Heading tag="h2" class="mb-4">Latest Deployment</Heading>
      {#if appState.project.info.Deployments.length === 0}
        <P>No deployments found.</P>
      {:else}
        {@const deployment = appState.project.info.Deployments.reverse()[0]}
        <div>
          <P>Created at: {new Date(deployment.CreatedAt).toLocaleString()}</P>
          <P id="created-by">
            Created by: {addressToName(deployment.CreatedBy)}
            (<span class="font-mono">
              {deployment.CreatedBy}
            </span>)
          </P>
          <P>Environment: {deployment.Environment}</P>
          <P>
            Location:
            <A href="https://ar.io/{deployment.Id}">
              https://ar.io/{deployment.Id}
            </A>
          </P>
        </div>
      {/if}
    {/if}
  </div>
{:else}
  <LandingPage {appState} />
{/if}
