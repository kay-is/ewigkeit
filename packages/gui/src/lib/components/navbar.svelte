<script lang="ts">
  const { projectId, projectName } = $props()
</script>

<div class="navbar bg-base-100">
  <a class="btn btn-ghost text-xl" href="/">Ewigkeit</a>
  <h2>Project: {projectName}&nbsp;</h2>
  <h2>({projectId})</h2>
</div>
