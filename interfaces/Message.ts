import type { Userstate } from 'tmi.js'

export default interface Message {
  id: string
  words: { content: string; isEmote: boolean }[]
  tags: Userstate
}
