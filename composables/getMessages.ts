import type { Ref } from '@vue/reactivity'
import tmi from 'tmi.js'
import { v4 as uuid } from 'uuid'
import type Message from '@/interfaces/Message'
const MAX_MESSAGE_HISTORY = 500
interface Props {
  channel: string
  filter: Ref<string>
  scroll: { autoscroll: Ref<boolean>; updateScroll: () => void }
}

export default async function (props: Props) {
  const { channel, scroll: { autoscroll, updateScroll } } = $(props)
  const filterDebounced = $(refDebounced(props.filter, 300))
  const client = new tmi.Client({
    connection: {
      secure: true,
      reconnect: true,
    },
    channels: [channel],
  })
  const messages = $(useState<Message[]>(`messages-${channel}`, () => []))
  const filteredMessages = $computed(() => {
    if (!filterDebounced.length)
      return messages
    return messages.filter((it) => {
      const filterValue = filterDebounced.toLowerCase()
      if (filterValue.startsWith('from:')) {
        const user = filterValue.split(':')[1].toLowerCase()
        return it.tags['display-name'].startsWith(user)
      }
      return it.words.map(it => it.content).join(' ').toLowerCase().includes(filterDebounced.toLowerCase())
    })
  })
  await client.connect()
  const emotes = $(await useState(`emotes-${channel}`, async () => await getEmotes(channel)).value)
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
  return { messages: $$(filteredMessages), client }
}
