<script lang="ts" context="module">
  import type { Ants } from "src/appState.svelte"

  export type PreviewDomainUpdate = {
    arnsDomain: string
    branch: string
    updateActiveDeployment: boolean
  }

  export type SetDomainModalProps = {
    ants: Ants
    open: boolean
    branch: string
    arnsDomain: string
    onSubmit: (domainUpdate: PreviewDomainUpdate) => void
  }
</script>

<script lang="ts">
  import {
    Button,
    ButtonGroup,
    Checkbox,
    Input,
    Label,
    Modal,
    Select,
  } from "flowbite-svelte"

  let {
    ants,
    open = $bindable(),
    branch,
    arnsDomain,
    onSubmit,
  }: SetDomainModalProps = $props()

  const domainWithUndernames = arnsDomain.split("_")

  let domain = $state(domainWithUndernames.pop() ?? "")
  let undername = $state(domainWithUndernames.join("_"))
  let updateActiveDeployment = $state(true)

  const handleSubmit = (e: Event) => {
    e.preventDefault()
    onSubmit({
      branch,
      arnsDomain: undername ? `${undername}_${domain}` : domain,
      updateActiveDeployment,
    })
    open = false
  }
</script>

<Modal bind:open size="xs" title="Assign Preview Domain" outsideclose>
  <form onsubmit={handleSubmit}>
    <div class="mb-4">
      <Label for="branch-input" class="mb-2">Git Branch</Label>
      <Input
        id="branch-input"
        bind:value={branch}
        class="font-mono"
        required={true}
      />
    </div>
    <div class="mb-4">
      <Label for="select-domain" class="mb-2">ArNS Domain</Label>
      <Select
        id="select-domain"
        items={Object.keys(ants).map((domain) => ({
          name: domain,
          value: domain,
        }))}
        bind:value={domain}
        class="font-mono"
        placeholder="Choose ArNS domain..."
        required={true}
      />
    </div>
    <div class="mb-4">
      <Label for="undername-input" class="mb-2">Undername</Label>
      <Input id="undername-input" bind:value={undername} class="font-mono" />
    </div>
    <div class="mb-4">
      <Label for="domain-output" class="mb-2">Result</Label>
      <Input
        id="domain-output"
        value={!!undername ? `${undername}_${domain}` : domain}
        class="font-mono"
        disabled={true}
      />
    </div>
    <div class="mb-4">
      <Checkbox class="w-full p-2" bind:checked={updateActiveDeployment}>
        Update active deployment domain
      </Checkbox>
    </div>
    <ButtonGroup class="w-full">
      <Button type="submit" color="primary" class="w-full mb-4">
        Set Domain
      </Button>
      <Button
        type="reset"
        color="light"
        class="w-full mb-4"
        onclick={() => (open = false)}>Cancel</Button
      >
    </ButtonGroup>
  </form>
</Modal>
