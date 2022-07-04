<script setup lang="ts">
interface Props {
  link: string
}
const props = defineProps<Props>()
let width = $ref(0)
let height = $ref(0)
function handleResize() {
  width = window.innerWidth
  height = window.innerHeight
}
onMounted(() => {
  width = window.innerWidth
  height = window.innerHeight
})
window.addEventListener('resize', handleResize)
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <iframe :src="props.link" :height="height" frameborder="0" :width="width" />
</template>

