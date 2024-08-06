<script lang="ts">
  const { projectId, projectName } = $props()
</script>

<div class="navbar bg-base-100">
  <div class="flex-1">
    <div class="tooltip tooltip-open tooltip-right" data-tip="v0.0.11">
      <a class="btn btn-outline text-xl" href="/">Ewigkeit</a>
    </div>
  </div>
  <div class="flex-none">
    <h2>{projectName} ({projectId})</h2>
  </div>
</div>
