<script setup lang="ts">
import tmi from 'tmi.js'
import { v4 } from 'uuid'
import Message from './Message.vue'
interface Props {
  channel: string
}

const props = defineProps<Props>()
const router = useRouter()
const emotes = $(await getEmotes(props.channel))

const messages = $ref([])

const chat = $ref(null)

let shouldShow = $ref(true)
const client = new tmi.Client({
  connection: {
    secure: true,
    reconnect: true,
  },
  channels: [`${props.channel}`],
})
client.connect()
function updateScroll() {
  chat.$el.scrollTop = chat.$el.scrollHeight
}
function handleKeyDown(e) {
  if (e.key === 'c')
    shouldShow = !shouldShow
  if (e.key === 'q')
    router.push('/')
  if (e.key === 'p')
    client.disconnect()
  if (e.key === 'r')
    client.connect()
}

client.on('message', (_, tags, message) => {
  const s = message.split(' ').map((it) => {
    for (const emote of emotes) {
      if (emote.name === it)
        return emote.url
    }
    return it
  })
  messages.push({
    text: s.join(' '),
    id: v4(),
    tags,
  })
  if (messages.length > 200)
    messages.shift()

  updateScroll()
})
window.addEventListener('keydown', handleKeyDown)
onUnmounted(() => {
  client.disconnect()
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <TransitionGroup ref="chat" tag="ul" name="list" :class="{ show: shouldShow }">
    <Message v-for="message in messages" :key="message.id" :message="message" />
  </TransitionGroup>
</template>

<style lang="scss" scoped>
ul {
  box-sizing: border-box;
  background-color: rgba(0, 0, 0, 0.7);
  height: 50vh;
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 1000;
  margin: 0;
  padding: 0 1rem 6rem 0.5rem;
  list-style-type: none;
  overflow-y: scroll;
  opacity: 0;
  transition: opacity 500ms, width 0s 500ms, height 0s 500ms;

  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.show {
  opacity: 1;
  width: clamp(20%,23vw,25%);
  height: 100%;
  transition: opacity 600ms, width 0s 0s, height 0s 0s;
}
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.list-leave-active {
  position: absolute;
}
</style>
