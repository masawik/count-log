import { sample } from 'lodash-es'
import { useCallback, useEffect, useState } from 'react'
import { useImmer } from 'use-immer'

import { COLOR_PALETTE, IS_TEST } from '@/shared/config'
import type { EmojiIconType } from '@/shared/ui'


import { useMatchEmoji } from './useMatchEmoji'

const INITIAL_EMOJI = '💖'

export interface useEmojiIconOptions {
  shouldNotSuggest?: boolean,
  initialValue?: EmojiIconType,
}

export const useEmojiIcon = (text: string, opts?: useEmojiIconOptions) => {
  const [ isEmojiSelectedByUser, setIsEmojiSelectedByUser ] =
    useState<boolean>(false)

  const [ emojiIcon, setEmojiIcon ] = useImmer<EmojiIconType>({
    emoji: INITIAL_EMOJI,
    color: IS_TEST ? COLOR_PALETTE[0] : sample(COLOR_PALETTE),

    ...opts?.initialValue,
  })

  const handlePickEmojiIcon = useCallback(
    (ei: EmojiIconType) => {
      setEmojiIcon(ei)
      setIsEmojiSelectedByUser(true)
    },
    [ setEmojiIcon ],
  )

  const { emoji, loading } = useMatchEmoji(text, {
      disabled: opts?.shouldNotSuggest || isEmojiSelectedByUser,
    })

    useEffect(() => {
      if (!emoji) return
      setEmojiIcon((e) => { e.emoji = emoji })
    }, [ emoji, setEmojiIcon ])

  return {
    handlePickEmojiIcon,
    loading,
    emojiIcon,
  }
}
