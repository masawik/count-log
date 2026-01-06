import { sample } from 'lodash-es'
import { useCallback, useEffect, useState } from 'react'
import { useImmer } from 'use-immer'

import type { EmojiIconType } from '@/entities/EmojiIcon'

import { COLOR_PALETTE, IS_TEST } from '@/shared/config'

import { useMatchEmoji } from './useMatchEmoji'

const INITIAL_EMOJI = '💖'

export const useEmojiIcon = (text: string) => {
  const [ isEmojiSelectedByUser, setIsEmojiSelectedByUser ] =
    useState<boolean>(false)

  const [ emojiIcon, setEmojiIcon ] = useImmer<EmojiIconType>({
    emoji: INITIAL_EMOJI,
    color: IS_TEST ? COLOR_PALETTE[0] : sample(COLOR_PALETTE),
  })

  const handlePickEmojiIcon = useCallback(
    (ei: EmojiIconType) => {
      setEmojiIcon(ei)
      setIsEmojiSelectedByUser(true)
    },
    [ setEmojiIcon ],
  )

  const { emoji, loading } = useMatchEmoji(text, {
      disabled: isEmojiSelectedByUser,
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
