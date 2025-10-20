<script setup lang="ts">
defineProps<{
  command?: boolean
}>()
</script>

<template>
  <nav flex="~ col gap2" text-size-base leading-normal mt-1 shrink h-full overflow-y-auto md:text-lg sm:px3>
    <NavSideItem text="Home" to="/home" icon="i-ri:home-5-line" :command="command" />

    <div class="spacer" shrink />
    <NavSideItem text="Games" to="/games" icon="i-ri:gamepad-line" :command="command" />
    <NavSideItem text="Rooms" to="/rooms" icon="i-ri:door-open-line" user-only :command="command" />
    <NavSideItem text="Chat" to="/chat" icon="i-ri:chat-3-line" user-only :command="command" />

    <div class="spacer" shrink />
    <NavSideItem text="Profile" to="/profile" icon="i-ri:user-line" user-only :command="command" />

    <div class="spacer" shrink hidden sm:block />
    <NavSideItem text="Settings" to="/settings" icon="i-ri:settings-3-line" :command="command" />
  </nav>
</template>

<style scoped>
  .spacer {
  margin-top: 0.5em;
}
@media screen and (max-height: 920px) and (min-width: 640px) {
  .spacer {
    margin-top: 0;
  }
}
</style>
