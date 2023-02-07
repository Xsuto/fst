import type { Userstate } from "tmi.js"

export default interface Message {
  id: string
  raw_message_content: string
  words: { content: string; isEmote: boolean }[]
  tags: Userstate
}
