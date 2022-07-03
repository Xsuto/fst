<template>
  <li :style="{color: props.message.tags.color}">
    <span v-if="props.message.tags.mod"><img class="badge moderator" src="https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/2"></span>
    <span v-if="props.message.tags.subscriber"><img class="badge" src="https://static-cdn.jtvnw.net/badges/v1/0ba17a24-d560-45d1-9b8d-6c133bb637f9/2"></span>
    {{props.message.tags["display-name"]}}: <span>{{props.message.text}}</span>
  </li>
</template>
<script setup lang="ts">
interface Props {
  message: object
}
const props = defineProps<Props>()
</script>

<style lang="scss" scoped>
li {
  font-family: 'Nunito', sans-serif;
  text-decoration: none;
  word-wrap: break-word;
  margin-bottom: .2rem;
  filter: brightness(1.3)
}
span {
  color: white
}
.badge {
  width: 1rem;
  height: 1rem;
  padding-right: .2rem;
}
</style>
