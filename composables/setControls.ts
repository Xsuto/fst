import type { Ref } from "vue"
import { Position } from "@/interfaces/ChatPosition"

enum Controls {
  HideChat = "c",
  ToggleSearchBar = "f",
  ToggleAutoScroll = "s",
  CloseSearchBar = "Escape",
  ExitPage = "q",
  MoveChatToRight = "ArrowRight",
  MoveChatToLeft = "ArrowLeft",
}

interface Props {
  showSearchBar: Ref<boolean>
  showChat: Ref<boolean>
  isTyping: Ref<boolean>
  autoscroll: Ref<boolean>
  chatPosition: Ref<Position>
}

export default function (props: Props) {
  // eslint-disable-next-line prefer-const,@typescript-eslint/no-unused-vars
  let { showSearchBar, isTyping, showChat, autoscroll, chatPosition } = $(props)
  const alt = $(useKeyModifier("Alt"))

  // Allow only one instance of Shortcuts
  let created = $(useState("shortcutsCreated", () => false))
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
    router.push("/")
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

  onKeyStroke(Controls.MoveChatToRight, () => {
    if (isTyping || !alt)
      return
    chatPosition = Position.right
  })

  onKeyStroke(Controls.MoveChatToLeft, () => {
    if (isTyping || !alt)
      return
    chatPosition = Position.left
  })
}
