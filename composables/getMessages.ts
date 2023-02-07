import type { Ref } from "@vue/reactivity"
import tmi from "tmi.js"
import { v4 as uuid } from "uuid"
import type Message from "@/interfaces/Message"
const MAX_MESSAGE_HISTORY = 500
interface Props {
  channel: string
  filter: Ref<string>
  scroll: { autoscroll: Ref<boolean>; updateScroll: () => void }
}

export default async function (props: Props) {
  const { channel, scroll: { autoscroll, updateScroll } } = $(props)
  const filterDebounced = $(refDebounced(props.filter, 200))
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
      if (filterValue.startsWith("from:")) {
        const user = filterValue.split(":")[1]
        return it.tags["display-name"].toLowerCase().startsWith(user)
      }
      return it.raw_message_content.includes(filterValue)
    })
  })
  await client.connect()
  const emotes = await getEmotes(channel)
  client.on("message", (_, tags, message) => {
    const data = message.split(" ").map((it) => {
      if (emotes.has(it))
        return { content: emotes.get(it), isEmote: true }

      return { content: it, isEmote: false }
    })
    messages.push({
      raw_message_content: message.toLowerCase(),
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
