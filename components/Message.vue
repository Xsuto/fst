<script setup lang="ts">
interface Props {
  message: {
    text: string
  }
}
const props = defineProps<Props>()
const messageContent = $computed(() => props.message.text.split(' '))
</script>

<template>
  <li :style="{ color: props.message.tags.color }">
    <span v-if="props.message.tags.mod">
      <img class="badge moderator" src="https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/2">
    </span>
    <span v-if="props.message.tags.subscriber">
      <img class="badge" src="https://static-cdn.jtvnw.net/badges/v1/0ba17a24-d560-45d1-9b8d-6c133bb637f9/2">
    </span>
    <p>{{ props.message.tags["display-name"] }}:</p>
    <span v-for="(word, i) in messageContent" :key="i">
      <img v-if="word.startsWith('https')" :src="word"><span v-else>{{ word }}</span>
    </span>
  </li>
</template>

<style lang="scss" scoped>
li {

  box-sizing: border-box;
  font-family: 'Nunito', sans-serif;
  text-decoration: none;
  word-wrap: break-word;
  margin-bottom: .2rem;
  font-size: clamp(0.8rem,1vw,1.5rem);
  filter: brightness(1.3);
  display: flex;
  height: auto;
  flex-wrap: wrap;
}
p {
  margin: 0 0.1rem;
  padding: 0;
}
span {
  color: white;
  margin: 0 0.1rem;
}
.badge {
  width: 1rem;
  height: 1rem;
  padding-right: .2rem;
}
</style>
