import type { Ref } from '@vue/reactivity'

enum Controls {
  HideChat = 'c',
  ToggleSearchBar = 'f',
  ToggleAutoScroll = 's',
  CloseSearchBar = 'Escape',
  ExitPage = 'q',
}
interface Props {
  showSearchBar: Ref<boolean>
  showChat: Ref<boolean>
  isTyping: Ref<boolean>
  autoscroll: Ref<boolean>
}

export default function (props: Props) {
  // eslint-disable-next-line prefer-const
  let { showSearchBar, isTyping, showChat, autoscroll } = $(props)

  // Allow only one instance of Shortcuts
  let created = $(useState('shortcutsCreated', () => false))
  if (created)
    return
  created = true
  onUnmounted(() => created = false)

  const router = useRouter()
  onKeyStroke(Controls.CloseSearchBar, () => {
    showSearchBar = false
  })
  onKeyStroke(Controls.ExitPage, () => {
    if (isTyping)
      return
    router.push('/')
  })
  onKeyStroke(Controls.HideChat, () => {
    if (isTyping)
      return
    showSearchBar = false
    showChat = !showChat
  })
  onKeyStroke(Controls.ToggleAutoScroll, () => {
    if (isTyping)
      return
    autoscroll = !autoscroll
  })
  onKeyStroke(Controls.ToggleSearchBar, () => {
    if (isTyping)
      return
    showSearchBar = !showSearchBar
  })
}
