<script setup lang="ts">
interface Props {
  isTyping: boolean
  filter: string
}
const props = defineProps<Props>()
const emit = defineEmits(['update:isTyping', 'update:filter'])
let idTimeout = $ref(0)
const DEBOUNCE_FOR = 300
function handleInput(event) {
  // Small debounce so we aren't updating messages array on every keystroke
  clearTimeout(idTimeout)
  idTimeout = setTimeout(() => emit('update:filter', event.target.value), DEBOUNCE_FOR)
}
</script>

<template>
  <div>
    <label for="search">Search for: </label>
    <input
      placeholder="Filter by"
      :value="filter"
      name="search"
      @focusin="$emit('update:isTyping', true)"
      @focusout="$emit('update:isTyping', false)"
      @input="handleInput"
    >
  </div>
</template>

<style scoped>
div {
  box-sizing: border-box;
  background-color: rgba(0, 0, 0, 0.7);
  height: 10vh;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 10;
  width: clamp(20%,23vw,25%);
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  align-items: center;
  flex-direction: column;
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
