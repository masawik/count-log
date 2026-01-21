import Picker from '@emoji-mart/react'
import './EmojiPicker.css'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import EmojiData from '@/shared/config/emoji-data-en-ru.json'

export type EmojiPickerProps = Parameters<typeof Picker>[0]

export function EmojiPicker(props: EmojiPickerProps) {
  const { i18n } = useTranslation()

  const stopEventPropagation = useCallback(
    (e: Pick<Event, 'stopPropagation'>) => e.stopPropagation(),
    [],
  )

  return (
    <div
      // https://github.com/missive/emoji-mart/issues/752
      onWheel={stopEventPropagation}
      onTouchMove={stopEventPropagation}
      className="EmojiPicker"
    >
      <Picker
        emojiButtonColors={[ 'var(--accent-2)' ]}
        emojiButtonRadius="8px"
        emojiVersion="15"
        icons="outlined"
        previewPosition="none"
        skinTonePosition="none"
        theme="light"
        data={EmojiData}
        locale={i18n.language}
        {...props}
      />
    </div>
  )
}
