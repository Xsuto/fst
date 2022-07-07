import type { Ref } from '@vue/reactivity'
import tmi from 'tmi.js'
import { v4 as uuid } from 'uuid'

const MAX_MESSAGE_HISTORY = 200

interface Message {
  id: string
  text: string
  tags: tmi.Userstate
}

export default async function (
  props: {
    channel: string
    filter: Ref<string>
    scroll: { autoscroll: Ref<boolean>; updateScroll: () => void }
  }) {
  const { channel, filter, scroll: { autoscroll, updateScroll } } = $(props)
  const client = new tmi.Client({
    connection: {
      secure: true,
      reconnect: true,
    },
    channels: [channel],
  })
  const messages = $ref<Message[]>([])
  const filteredMessages = $computed(() => messages.filter(it => it.text.includes(filter)))
  await client.connect()
  const emotes = $(await getEmotes(channel))
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
