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
        <P class="mb-2">No deployments found.</P>
        <Heading tag="h3" class="my-2">Getting Started</Heading>
        <P class="mb-2">Follow these steps to make your first deployment.</P>
        <P class="mb-2">1. Install the ewig CLI.</P>
        <pre class="mb-2 text-gray-500"><code>npm i -G @kay-is/ewig</code></pre>
        <P class="mb-2">2. Create a deployment wallet.</P>
        <pre class="mb-2 text-gray-500"><code>ewig login</code></pre>
        <P class="mb-2">
          3. Add the address of the deployment wallet to
          <A href="./members.html#{appState.project.id}">the project members</A
          >.
        </P>
        <P class="mb-2">4. Link your source directory to this project.</P>
        <pre class="mb-2 text-gray-500"><code
            >ewig link {appState.project.id}</code
          ></pre>
        <P class="mb-2">
          5. Make sure the created <code>ewig.json</code> points to your build directory.
          (e.g., dist, build, public, etc.)
        </P>
        <P class="mb-2">6. Build the project.</P>
        <pre class="mb-2 text-gray-500"><code>npm run build</code></pre>
        <P class="mb-2">7. Deploy a preview.</P>
        <pre class="mb-2 text-gray-500"><code>ewig deploy</code></pre>
        <P class="mb-2">8. Refresh this page.</P>
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
            <A href="https://ar-io.dev/{deployment.Id}">
              https://ar-io.dev/{deployment.Id}
            </A>
          </P>
        </div>
      {/if}
    {/if}
  </div>
{:else}
  <LandingPage {appState} />
{/if}
