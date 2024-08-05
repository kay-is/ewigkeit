<script lang="ts">
  interface LoadingProps {
    loading: string
  }
  let { loading }: LoadingProps = $props()
</script>

{#if loading !== ''}
  <dialog class="modal modal-open">
    <div class="modal-box flex justify-center items-center">
      <p class="text-lg text-center">
        <span class="loading loading-infinity loading-lg"></span><br />
        {loading}
      </p>
    </div>
  </dialog>
{/if}
