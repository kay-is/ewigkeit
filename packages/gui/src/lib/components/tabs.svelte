<script lang="ts">
  type ActiveTab = 'overview' | 'deployments' | 'domains' | 'members'
  export let activeTab: ActiveTab

  const isActive = (tab: ActiveTab) => (tab === activeTab ? 'tab-active' : '')
</script>

<div role="tablist" class="tabs tabs-bordered">
  <a role="tab" class="tab {isActive('overview')}" href="./overview">Overview</a>
  <a role="tab" class="tab {isActive('deployments')}" href="./deployments">Deployments</a>
  <a role="tab" class="tab {isActive('domains')}" href="./domains">Domains</a>
  <a role="tab" class="tab {isActive('members')}" href="./members">Members</a>
</div>
