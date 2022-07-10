<script setup lang="ts">
import setControls from '~/composables/setControls'

interface Props {
  channel: string
}
const props = defineProps<Props>()

const chat = $ref(null)
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
setControls($$({ autoscroll, isTyping, showSearchBar, showChat }))
</script>

<template>
  <main :class="{ showContainer: showChat }">
    <SearchBar v-if="showSearchBar" v-model:isTyping="isTyping" v-model:filter="filter" />
    <ul @scroll="autoscroll = false" ref="chat" :class="{ showMessages: showChat } ">
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
  width: clamp(20%,23vw,25%);
  height: 100%;
  transition: opacity 500ms, width 0ms 0ms, height 0ms 0ms;
}
.showMessages {
  opacity: 1;
}
</style>
