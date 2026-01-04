import Picker from '@emoji-mart/react'
import './EmojiPicker.css'

export type EmojiPickerProps = Parameters<typeof Picker>[0]

export function EmojiPicker(props: EmojiPickerProps) {

  const stopEventPropagation = (e: Pick<Event, 'stopPropagation'>) => e.stopPropagation()

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
        {...props}
      />
    </div>
  )
}
