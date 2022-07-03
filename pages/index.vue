<template>
<div>
<label for="channel">Channel name</label>
<input type="channel" name="channel" v-model="channel" />
<button @click="handleClick">Go</button>
<ul>
  <li v-for="savedChannel in savedChannels" :key="savedChannel.id">
    <NuxtLink :to="{ path: `/dashboard/${savedChannel.channel}` }">{{
        savedChannel.channel
      }}</NuxtLink>
  </li>
</ul>
</div>
</template>

<script setup lang="ts">
import { v4 as uuid } from 'uuid';
import {$computed} from "vue/macros";
let channel = $ref("")
let savedChannels = $computed(() => JSON.parse(localStorage.getItem('channels')))
const router = useRouter()

function handleClick() {
  if (!channel) return;
  const tempSavedChannels = JSON.parse(localStorage.getItem('channels')) || [];
  localStorage.setItem(
      'channels',
      JSON.stringify([...tempSavedChannels, { channel: channel, id: uuid() }]),
  );
  router.push({ path: `/dashboard/${channel}`})
}
</script>

<style scoped lang="scss">
div {
  text-align: left;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}
</style>

