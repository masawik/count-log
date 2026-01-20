import data, { type Emoji } from '@emoji-mart/data'
import { init, SearchIndex } from 'emoji-mart'
import { startTransition, useEffect, useRef, useState } from 'react'

void init({ data })

async function matchEmoji(query: string) {
  const words = query.split(' ')
  for (const word of words) {
    const emojis = (await SearchIndex.search(word, {
      maxResults: 1,
      caller: undefined,
    })) as Emoji[]
    if (emojis?.length) {
      return emojis[0]
    }
  }

  return null
}

export interface UseEmojiOpts {
  delay?: number,
  disabled?: boolean,
}

export const useMatchEmoji = (text: string, opts?: UseEmojiOpts) => {
  const { disabled = false, delay = 500 } = opts || {}

  const [ matchedEmoji, setMatchedEmoji ] = useState<string | null>(null)
  const [ loading, setLoading ] = useState<boolean>(false)
  const changeLoadingState = (value: boolean) =>
    startTransition(() => setLoading(value))

  const debounceTimer = useRef<undefined | number>(undefined)

  useEffect(() => {
    clearTimeout(debounceTimer.current)

    if (disabled || !text) {
      changeLoadingState(false)
      return
    }

    debounceTimer.current = window.setTimeout(() => {
      void (async () => {
        try {
          const result = await matchEmoji(text)
          const emoji = result?.skins?.[0].native

          if (emoji) {
            setMatchedEmoji(emoji)
          }
        } finally {
          changeLoadingState(false)
        }
      })()
    }, delay)

    startTransition(() => {
      changeLoadingState(true)
    })

    return () => clearTimeout(debounceTimer.current)
  }, [ text, disabled, delay ])

  return {
    loading,
    emoji: matchedEmoji,
  }
}
