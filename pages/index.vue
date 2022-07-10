<script setup lang="ts">
import { v4 as uuid } from 'uuid'
import IconDelete from '~icons/fluent/delete-16-regular'
const channel = $ref('')
interface Channel {
  channel: string
  id: string
}
let savedChannels = $ref(useLocalStorage<Channel[]>('channels', []))
const router = useRouter()
function handleClick() {
  if (!channel)
    return
  savedChannels = [{ channel, id: uuid() }, ...savedChannels]
  router.push({ path: `/dashboard/${channel}` })
}
function handleDelete(id: string) {
  savedChannels = savedChannels.filter(it => it.id !== id)
}

function handleLinkClick(channel: Channel) {
  const tempSavedChannels = savedChannels.filter(it => it.id !== channel.id)
  savedChannels = [channel, ...tempSavedChannels]
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
        <h1>Previously Watched</h1>
        <ul class="resizable-content">
          <li v-for="savedChannel in savedChannels" :key="savedChannel.id">
            <NuxtLink :to="{ path: `/dashboard/${savedChannel.channel}` }" @click="handleLinkClick(savedChannel)">
              {{
                savedChannel.channel
              }}
            </NuxtLink>
            <IconDelete class="deleteIcon" @click="handleDelete(savedChannel.id)" />
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
.deleteIcon {
  transition: 200ms;
  cursor: pointer;
  &:hover {
    color: #cbd5e1;
  }
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
  margin:  1rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
}
a {
  text-decoration-color: #e2e2e2;
  cursor: pointer;
  transition: 200ms;
  &:hover {
    filter: brightness(1.6);
  }
}
</style>

