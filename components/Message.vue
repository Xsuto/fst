<script setup lang="ts">
import type Message from '@/interfaces/Message'
interface Props {
  message: Message
}
defineProps<Props>()
</script>

<template>
  <li :style="{ color: message.tags.color }">
    <span v-if="message.tags.mod">
      <img
        alt="user is a moderator"
        class="badge moderator"
        src="https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/2"
      >
    </span>
    <span v-if="message.tags.subscriber">
      <img
        alt="user is a subscriber"
        class="badge"
        src="https://static-cdn.jtvnw.net/badges/v1/0ba17a24-d560-45d1-9b8d-6c133bb637f9/2"
      >
    </span>
    <p>{{ message.tags["display-name"] }}:</p>
    <span v-for="(it, i) in message.words" :key="i">
      <img v-if="it.isEmote" alt="emote" :src="it.content">
      <template v-else>
        <NuxtLink
          v-if="!it.isEmote && it.content.startsWith('http')"
          target="_blank" :to="it.content"
        >
          {{ it.content }}
        </NuxtLink>
        <span v-else>{{ it.content }}</span>
      </template>
    </span>
  </li>
</template>

<style lang="scss" scoped>
li {
  box-sizing: border-box;
  position: relative;
  font-family: 'Nunito', sans-serif;
  text-decoration: none;
  word-wrap: break-word;
  margin-bottom: .2rem;
  font-size: 1rem;
  filter: brightness(1.3);
  display: flex;
  height: auto;
  word-break: break-all;
  flex-wrap: wrap;
}
p {
  margin: 0 0.05rem;
  padding: 0;
}
a, span {
  color: white;
  margin: 0 0.05rem;
}
.badge {
  width: 1rem;
  height: 1rem;
  padding-right: .2rem;
}
</style>
