<script setup lang="ts">
interface Props {
  isTyping: boolean
  filter: string
}
const props = defineProps<Props>()
const emit = defineEmits(['update:isTyping', 'update:filter'])
const inputRef = $ref(null)
const idTimeout = $ref(0)
const DEBOUNCE_FOR = 300
function handleInput(event) {
  emit('update:filter', event.target.value)
}
onMounted(() => {
  setTimeout(() => {
    inputRef.focus()
  }, 100)
})
onUnmounted(() => {
  emit('update:filter', '')
})
</script>

<template>
  <div>
    <label for="search">Search for: </label>
    <input
      ref="inputRef"
      placeholder="Filter by"
      :value="filter"
      name="search"
      @focusin="$emit('update:isTyping', true)"
      @focusout="$emit('update:isTyping', false)"
      @input="$emit('update:filter', $event.target.value)"
    >
  </div>
</template>

<style scoped>
div {
  position: relative;
  height: 10%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}
label {
  color: white;
  width: 100%;
  font-size: 1.5rem;
}
input {
  box-sizing: border-box;
  width: 100%;
  font-size: 1.5rem;
  border: none;
  border-radius: 1rem;
  background-color: #0f172a;
  color: white;
  padding: 0 1rem;
}
</style>
