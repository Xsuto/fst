<template>
    <ul :class="{ show: shouldShow }" ref="chat">
      <Message v-for="(message, i) in messages" :key="i" :message="message" />
    </ul>
</template>

<script setup lang="ts">
import tmi from 'tmi.js';
import VueResizable from "vue-resizable"
import Message from './Message.vue';
interface Props {
  channel: string
}
const props = defineProps<Props>()
const router = useRouter();
const messages = $ref([]);
const chat = $ref(null);
const shouldShow = $ref(true);
const client = new tmi.Client({
  connection: {
    secure: true,
    reconnect: true,
  },
  channels: [`${props.channel}`],
});
client.connect();
function updateScroll() {
  try {
    chat.scrollTop = chat.scrollHeight;
  } catch (err) {
    console.log(err);
  }
}
function handleKeyDown(e) {
  if (e.key === 'c') shouldShow = !shouldShow;
  if (e.key === 'q') router.push({ name: 'home' });
}
client.on('message', (_, tags, message) => {
  // "Alca: Hello, World!"
  messages.push({
    text: message,
    tags,
  });
  updateScroll();
});
window.addEventListener('keydown', handleKeyDown);
onUnmounted(() => {
  client.disconnect();
  window.removeEventListener('keydown', handleKeyDown);
});
</script>
<style lang="scss" scoped>
ul {
  background-color: rgba(0, 0, 0, 0.7);
  height: 50vh;
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 1000;
  margin: 0;
  padding: 0;
  padding-right: 1rem;
  padding-left: 0.5rem;
  list-style-type: none;
  overflow-y: scroll;
  opacity: 0;
  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.show {
  opacity: 1;
  width: 20%;
  height: 100vh;
}
</style>
