<template>
  <div ref="dashboard" class="dashboard">
    <twitch-iframe :link="link"/>
    <Chat :channel="channel"/>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
const route = useRoute();
const dashboard = ref(null);
const href = computed(() => window.location.host.split(':')[0])
const channel = computed(() => route.params.channel);
const link = computed(() => `https://player.twitch.tv/?channel=${channel.value}&parent=${href.value}`);
</script>

<style lang="scss" scoped>

.dashboard {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
