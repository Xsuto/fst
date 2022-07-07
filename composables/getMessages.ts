import type { Ref } from '@vue/reactivity'
import tmi from 'tmi.js'
import { v4 as uuid } from 'uuid'
import type Message from '@/interfaces/Message'
const MAX_MESSAGE_HISTORY = 1000

export default async function (
  props: {
    channel: string
    filter: Ref<string>
    scroll: { autoscroll: Ref<boolean>; updateScroll: () => void }
  }) {
  const { channel, scroll: { autoscroll, updateScroll } } = $(props)
  const filterDebounced = $(refDebounced(props.filter, 300))
  const client = new tmi.Client({
    connection: {
      secure: true,
      reconnect: true,
    },
    channels: [channel],
  })
  const messages = $ref<Message[]>([])
  const filteredMessages = $computed(() => messages.filter(it =>
    it.words.map(it => it.content).join(' ').toLowerCase().includes(filterDebounced.toLowerCase(),
    )))
  await client.connect()
  const emotes = $(await getEmotes(channel))
  client.on('message', (_, tags, message) => {
    const data = message.split(' ').map((it) => {
      for (const emote of emotes) {
        if (emote.name === it)
          return { content: emote.url, isEmote: true }
      }
      return { content: it, isEmote: false }
    })
    messages.push({
      words: data,
      id: uuid(),
      tags,
    })
    if (messages.length > MAX_MESSAGE_HISTORY)
      messages.shift()
    if (autoscroll)
      updateScroll()
  })
  onUnmounted(() => {
    client.disconnect()
  })
  return { messages: $$(filteredMessages), client: $$(client) }
}
