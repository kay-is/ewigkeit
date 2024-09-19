<script lang="ts">
  import Wallet from "./wallet.svelte"

  const { name }: { name: string } = $props()

  const wallet = $state({
    connected: false,
    name: "",
    address: "",
  })

  const connect = async () => {
    wallet.connected = true
    wallet.name = name
    wallet.address = "0x12345678"
  }

  const disconnect = async () => {
    wallet.connected = false
    wallet.name = ""
    wallet.address = ""
  }
</script>

<Wallet wallet={{ ...wallet, connect, disconnect }} />
