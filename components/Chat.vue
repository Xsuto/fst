<script setup lang="ts">
interface Props {
  channel: string
}

const props = defineProps<Props>()
const router = useRouter()

const chat = $ref(null)
const filter = $ref('')
const isTyping = $ref(false)

let shouldShow = $ref(true)
let showSearchBar = $ref(false)
let autoscroll = $ref(true)
function updateScroll() {
  // chat.$el.scrollTop = chat.$el.scrollHeight
  chat.scrollTop = chat.scrollHeight
}
const { messages, client } = $(await getMessages({
  channel: props.channel,
  filter: $$(filter),
  scroll: { autoscroll: $$(autoscroll), updateScroll },
}))
function handleKeyDown(e) {
  if (isTyping)
    return
  if (e.key === 'c')
    shouldShow = !shouldShow
  if (e.key === 'q')
    router.push('/')
  if (e.key === 'p')
    client.disconnect()
  if (e.key === 'r')
    client.connect()
  if (e.key === 'f')
    showSearchBar = !showSearchBar
  if (e.key === 's')
    autoscroll = !autoscroll
}

window.addEventListener('keydown', handleKeyDown)
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>

  <SearchBar v-if="showSearchBar" v-model:isTyping="isTyping" v-model:filter="filter" />
  <!--  Huge lag because of Animation over 200 items -->
  <!--  <TransitionGroup ref="chat" tag="ul" name="list" :class="{ show: shouldShow, accountForSearchBar: shouldShow && showSearchBar }"> -->
  <!--    <Message v-for="message in messages" :key="message.id" :message="message" /> -->
  <!--  </TransitionGroup> -->
  <ul ref="chat" :class="{ show: shouldShow, accountForSearchBar: shouldShow && showSearchBar }">
    <Message v-for="message in messages" :key="message.id" :message="message" />
  </ul>
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
  z-index: 1;
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
.accountForSearchBar {
  top: 10vh;
  height: 90%;
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
