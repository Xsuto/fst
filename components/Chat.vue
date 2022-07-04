<template>
    <TransitionGroup id="list" tag="ul" name="list" :class="{ show: shouldShow }" ref="chat">
      <Message v-for="message in messages" :key="message.id" :message="message" />
    </TransitionGroup>
</template>

<script setup lang="ts">
import tmi from 'tmi.js';
import { v4 } from "uuid"
import Message from './Message.vue';
import {$computed} from "vue/macros";
interface Props {
  channel: string
}
// id: '60f46370f7fdd1860a565b52',
//     name: 'TriHardoM',
//     owner: {
//   id: '60cb6ed794befb7c93c441e2',
//       twitch_id: '',
//       login: 'alwayslucky__',
//       display_name: 'alwayslucky__',
//       role: [Object]
// },
// visibility: 0,
//     visibility_simple: [],
//     mime: 'image/webp',
//     status: 3,
//     tags: [],
//     width: [ 32, 48, 76, 128 ],
//     height: [ 32, 48, 76, 128 ],
//     urls: [ [Array], [Array], [Array], [Array] ]
interface Emote {
  name: string,
  width: number[],
  height: number[],
  urls: string[]
}
const props = defineProps<Props>()
const router = useRouter();
const {data: emotes} = $( await useFetch<Emote[]>("https://api.7tv.app/v2/users/h2p_gucio/emotes"))
// https://api.7tv.app/v2/emotes/global
const {data: globalEmotes} = $( await useFetch<Emote[]>("https://api.7tv.app/v2/emotes/global"))
// "https://api.ivr.fi/twitch/resolve/" + channel
const {data: twitchUser} = $( await useFetch<string>(`https://api.ivr.fi/twitch/resolve/${props.channel}`))
// "https://api.betterttv.net/3/cached/users/twitch/" + twitchID
const {data} = $( await useFetch<object>("https://api.betterttv.net/3/cached/users/twitch/" + twitchUser.id))
const bttvEmotes = $computed(() => data.sharedEmotes)
let messages = $ref([]);

// FIXME: BIG HACK transition-group collides with ref and we cannot get access to ul so, We get the ul by id
let chat = $ref(null)

let shouldShow = $ref(true);
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
    chat.$el.scrollTop = chat.$el.scrollHeight;
  } catch (err) {
    console.log(err);
  }
}
function handleKeyDown(e) {
  if (e.key === 'c') shouldShow = !shouldShow;
  if (e.key === 'q') router.push("/");
  if (e.key === 'p') client.disconnect()
  if (e.key === 'r') client.connect()
}

client.on('message', (_, tags, message) => {
  console.log(data)
  const s = message.split(" ").map(it => {
      for (const emote of emotes) {
        if (emote.name == it)
          return emote.urls[0][1]
      }
    for (const emote of globalEmotes) {
      if (emote.name == it)
        return emote.urls[0][1]
    }
    for (const emote of bttvEmotes) {
      if (emote.code == it)
        return `https://cdn.betterttv.net/emote/${emote.id}/1x`
    }
    return it
  })
  messages.push({
    text: s.join(" "),
    id: v4(),
    tags,
  });
  if (messages.length > 30 ) {
    // client.disconnect()
  }

  if (messages.length > 200) {
    messages.shift()
  }
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
  box-sizing: border-box;
  background-color: rgba(0, 0, 0, 0.7);
  height: 50vh;
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 1000;
  margin: 0;
  padding: 0 1rem 0 0.5rem;
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
  transition: all 0.2s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
