<script setup lang="ts">
import { v4 as uuid } from 'uuid'
import { $computed } from 'vue/macros'
const channel = $ref('')
const savedChannels = $computed(() => JSON.parse(localStorage.getItem('channels')))
const router = useRouter()
function handleClick() {
  if (!channel)
    return
  const tempSavedChannels = JSON.parse(localStorage.getItem('channels')) || []
  localStorage.setItem(
    'channels',
    JSON.stringify([...tempSavedChannels, { channel, id: uuid() }]),
  )
  router.push({ path: `/dashboard/${channel}` })
}
</script>

<template>
  <div class="container">
    <div class="content">
      <label for="channel">Channel name</label>
      <main>
        <input v-model="channel" placeholder="Channel name" name="channel" required>
        <button @click="handleClick">
          Watch!
        </button>
      </main>
      <div class="links">
        <ul class="resizable-content">
          <h1>Previously Watched</h1>
          <li v-for="savedChannel in savedChannels" :key="savedChannel.id">
            <NuxtLink :to="{ path: `/dashboard/${savedChannel.channel}` }">
              {{
                savedChannel.channel
              }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
*  {
  color: white;
}
label {
  font-size: 5rem
}
main {
  width: 100%;
  display: flex;
  gap: 5%
}
input {
  width: 60%;
  height: 2rem;
  background-color: #0f172a;
  border: none;
  padding: 1rem;
  border-radius: 1rem;
  font-size: 2rem;
}
button {
  width: 30%;
  background-color: #374151;
  border: none;
  border-radius: 1rem;
  font-size: 2rem;
  transition: 500ms;
  cursor: pointer;

  &:hover {
    background-color: #475569;
  }
}
.links {
  width: 100%;
  margin: 0;
  padding: 0;
}
.content {
  display: flex;
  gap: 1rem;
  flex-direction: column;
  margin: 0 auto;
}
.container {
  width: 100%;
  background-color: #1e293b;
  text-align: left;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}
li {
  font-size: 2rem;
}
</style>

