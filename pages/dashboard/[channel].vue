<script lang="ts" setup>
const route = useRoute()
const href = $computed(() => window.location.host.split(":")[0])
const channel = $computed(() => route.params.channel)
const link = computed(() => `https://player.twitch.tv/?channel=${channel}&parent=${href}`)
</script>

<template>
  <div class="dashboard">
    <twitch-iframe :link="link" />
    <Chat :channel="channel" />
  </div>
</template>

<style lang="scss" scoped>
.dashboard {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
