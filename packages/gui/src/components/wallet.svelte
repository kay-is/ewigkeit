<script lang="ts">
  import Button from "flowbite-svelte/Button.svelte"
  import ButtonGroup from "flowbite-svelte/ButtonGroup.svelte"
  import Input from "flowbite-svelte/Input.svelte"
  import InputAddon from "flowbite-svelte/InputAddon.svelte"
  import WalletOutline from "flowbite-svelte-icons/WalletOutline.svelte"

  import type { WalletStateWithMethods } from "../appState.svelte"
  import { Popover, Toast } from "flowbite-svelte"

  const { wallet }: { wallet: WalletStateWithMethods } = $props()
</script>

{#if wallet.connected}
  <ButtonGroup id="logout-group">
    <InputAddon><WalletOutline /></InputAddon>
    <Input
      id="input-addon"
      value={wallet.name}
      class="font-mono disabled:cursor-default"
      disabled
    />
    <Popover triggeredBy="#logout-group" class="font-mono">
      {wallet.address}
    </Popover>
    <Button onclick={wallet.disconnect} color="light">Disconnect</Button>
  </ButtonGroup>
{:else}
  <Button onclick={wallet.connect}>Connect</Button>
{/if}
