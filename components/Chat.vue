<script setup lang="ts">
import { Position } from '@/interfaces/ChatPosition'
interface Props {
  channel: string
}
const props = defineProps<Props>()

const chat = $ref(null)
const chatPosition = $(useLocalStorage<Position>('chat-position', Position.right))
const filter = $ref('')
const isTyping = $ref(false)
const showChat = $ref(true)
const showSearchBar = $ref(false)
const autoscroll = $ref(true)

function updateScroll() {
  // chat.$el.scrollTop = chat.$el.scrollHeight
  chat.scrollTop = chat.scrollHeight
}
const { messages, client } = $(await getMessages({
  channel: props.channel,
  filter: $$(filter),
  scroll: { autoscroll: $$(autoscroll), updateScroll },
}))
onUnmounted(async () => {
  client.removeAllListeners()
  await client.disconnect()
})
setControls($$({ autoscroll, isTyping, showSearchBar, showChat, chatPosition }))
</script>

<template>
  <main :class="{ showContainer: showChat, showChatOnLeftSide: chatPosition === Position.left }">
    <SearchBar v-if="showSearchBar" v-model:isTyping="isTyping" v-model:filter="filter" />
    <ul ref="chat" :class="{ showMessages: showChat } ">
      <Message v-for="message in messages" :key="message.id" :message="message" />
    </ul>
  </main>
</template>

<style lang="scss" scoped>
main {
  box-sizing: border-box;
  background-color: rgba(0, 0, 0, 0.5);
  height: 50vh;
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  margin: 0;
  opacity: 0;
  display: flex;
  flex-direction: column;
  transition: opacity 500ms, width 0ms 500ms, height 0ms 500ms;
}
ul {
  flex-grow: 1;
  position: relative;
  box-sizing: border-box;
  width: 100%;
  margin: 0;
  padding: 0.5rem 1rem 6rem 0.5rem;
  list-style-type: none;
  overflow-y: scroll;
  opacity: 0;
//  transition: opacity 500ms, width 0s 500ms, height 0s 500ms;

  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none; /* IE and Edgdde */
  scrollbar-width: none; /* Firefox */
}
//
.showContainer {
  opacity: 1;
  width: max(400px,20%);
  height: 100%;
  transition: opacity 500ms, width 0ms 0ms, height 0ms 0ms;
}
.showChatOnLeftSide {
  left: 0;
  right: unset;
}
.showMessages {
  opacity: 1;
}
</style>
