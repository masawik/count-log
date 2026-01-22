import { useCallback, useEffect, useEffectEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { EmojiIcon, EmojiIconPicker, type EmojiIconType } from '@/shared/ui'

import { useMatchEmoji } from './useMatchEmoji'

export type EmojiIconInputProps = {
  value: EmojiIconType,
  onChange?: (value: EmojiIconType) => void,
  suggestionText?: string,
}

export const EmojiIconInput = ({
  value,
  onChange,
  suggestionText,
}: EmojiIconInputProps) => {
  const { t } = useTranslation()
  const [ isPickerVisible, setIsPickerVisible ] = useState(false)
  const [ innerValue, setInnerValue ] = useState(value)
  const [ isEmojiSelectedByUser, setIsEmojiSelectedByUser ] =
    useState<boolean>(false)

  const setValue = useCallback(
    (value: EmojiIconType) => {
      onChange?.(value)
      setInnerValue(value)
    },
    [ onChange ],
  )

  const handlePickEmojiIcon = useCallback(
    (ei: EmojiIconType) => {
      setValue(ei)
      setIsEmojiSelectedByUser(true)
    },
    [ setValue ],
  )

  const { emoji: suggestedEmoji, loading } = useMatchEmoji(
    suggestionText || '',
    {
      disabled: !suggestionText || isEmojiSelectedByUser,
    },
  )

  const setSuggestedEmoji = useEffectEvent((emoji: EmojiIconType['emoji']) => {
    setValue({ ...innerValue, emoji })
  })

  useEffect(() => {
    if (!suggestedEmoji) return

    setSuggestedEmoji(suggestedEmoji)
  }, [ suggestedEmoji ])

  return (
    <>
      <button
        onClick={() => setIsPickerVisible(true)}
        type="button"
        aria-label={t('Edit an icon')}
        data-test-id="EmojiIconInput"
      >
        <EmojiIcon
          emoji={innerValue?.emoji}
          color={innerValue?.color}
          className="size-17"
          loading={loading}
        />
      </button>

      {isPickerVisible && (
        <EmojiIconPicker
          emojiIcon={innerValue}
          open
          onOpenChange={setIsPickerVisible}
          onPick={handlePickEmojiIcon}
        />
      )}
    </>
  )
}
