interface Emote7tv {
  name: string
  width: number[]
  height: number[]
  urls: [string[]]
}
interface EmoteBttv {
  code: string
  id: string
}
interface BttvResponse {
  sharedEmotes: EmoteBttv[]
}
interface FfzResponse {
  sets: {
    [key: number]: {
      emoticons: {
        name: string
        urls: string[]
      }[]
    }
  }
}
interface Emote {
  name: string
  url: string
}
export async function getEmotes(channel: string) {
  const emotes = $ref<Emote[]>([])
  const { data: twitchUser } = $(await useFetch<{ id: string }>(`https://api.ivr.fi/twitch/resolve/${channel}`))
  const Emotes7tvPromise = useFetch<Emote7tv[]>(`https://api.7tv.app/v2/users/${channel}/emotes`, { default: () => [] })
  const EmotesGlobal7tvPromise = useFetch<Emote7tv[]>('https://api.7tv.app/v2/emotes/global')
  const EmotesBttvPromise = useFetch<BttvResponse>(`https://api.betterttv.net/3/cached/users/twitch/${twitchUser.id}`)
  const EmotesGlobalBttvPromise = useFetch<EmoteBttv[]>('https://api.betterttv.net/3/cached/emotes/global')
  const EmotesFfzPromise = useFetch<FfzResponse>('https://api.frankerfacez.com/v1/set/global')
  const EmotesFfzGlobalPromise = useFetch<FfzResponse>(`https://api.frankerfacez.com/v1/room/${channel}`)
  const [{ data: emotes7tv }, { data: globalEmotes7tv },
    { data: bttvResponse }, { data: globalEmotesBttv }, { data: ffzUserEmotes },
    { data: ffzGlobalEmotes }] = await Promise.all(
    [Emotes7tvPromise,
      EmotesGlobal7tvPromise, EmotesBttvPromise, EmotesGlobalBttvPromise,
      EmotesFfzPromise, EmotesFfzGlobalPromise])

  const bttvEmotes = $computed(() => bttvResponse.value?.sharedEmotes || [])
  for (const { name, urls } of emotes7tv.value) {
    emotes.push({
      name,
      url: urls[0][1],
    })
  }
  for (const { name, urls } of globalEmotes7tv.value) {
    emotes.push({
      name,
      url: urls[0][1],
    })
  }
  for (const emote of bttvEmotes) {
    emotes.push({
      name: emote.code,
      url: `https://cdn.betterttv.net/emote/${emote.id}/1x`,
    })
  }
  for (const emote of globalEmotesBttv.value) {
    emotes.push({
      name: emote.code,
      url: `https://cdn.betterttv.net/emote/${emote.id}/1x`,
    })
  }
  for (const emoteKey in ffzGlobalEmotes.value?.sets) {
    const it = ffzGlobalEmotes.value.sets[emoteKey].emoticons
    for (const emote of it) {
      emotes.push({
        name: emote.name,
        url: `https://${emote.urls['1']}`,
      })
    }
  }
  for (const emoteKey in ffzUserEmotes.value?.sets) {
    const it = ffzUserEmotes.value.sets[emoteKey].emoticons
    for (const emote of it) {
      emotes.push({
        name: emote.name,
        url: `https://${emote.urls['1']}`,
      })
    }
  }
  return $$(emotes)
}
