<script lang="ts">
  import "./style.css"
  import { setContext } from "svelte"
  import { AppState } from "./appState.svelte"

  const appState = new AppState()

  setContext("appState", appState)
</script>

<h1>Overview</h1>

{#if appState.wallet.connected}
  <h1>Name: {appState.wallet.name}</h1>
  <h2>
    Address: {appState.wallet.address}
  </h2>
  <button onclick={appState.wallet.disconnect}>Disconnect</button>
{:else}
  <button onclick={appState.wallet.connect}>Connect</button>
{/if}

{#if appState.loading}
  Loading...
{:else}
  <pre>
    {JSON.stringify(appState.project.info, null, 4)}
  </pre>
{/if}
