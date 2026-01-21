import emojiData from '@emoji-mart/data'
import { Button, Tabs } from '@radix-ui/themes'
import { pick } from 'lodash-es'
import { useMemo, useState } from 'react'

import { COLOR_PALETTE, type Color } from '@/shared/config'
import { cn } from '@/shared/lib'
import { EmojiIcon, type EmojiIconType } from '@/shared/ui'
import { EmojiPicker, Dialog } from '@/shared/ui'

import type React from 'react'

import './EmojiIconPicker.css'

const DIALOG_ROOT_PROPS: Array<keyof Dialog.RootProps> = [
  'defaultOpen',
  'onOpenChange',
  'open',
]

export interface EmojiIconPickerProps extends Dialog.RootProps {
  emojiIcon?: EmojiIconType,
  onPick?: (result: EmojiIconType) => void,
}

const ColorSquare = ({
  color,
  active,
  ...props
}: {
  color: Color,
  active: boolean,
} & React.HTMLAttributes<HTMLButtonElement>) => (
  <button
    style={{
      backgroundColor: `var(--${color}-10)`,
      outlineColor: 'var(--accent-7)',
    }}
    className={cn('size-10 rounded-xl', {
      'outline-4 outline-offset-2': active,
    })}
    {...props}
  />
)

export const EmojiIconPicker = function EmojiIconPicker({
  children,
  defaultOpen,
  onPick,
  ...props
}: EmojiIconPickerProps) {
  const [ internalOpen, setInternalOpen ] = useState<boolean>(
    defaultOpen || false,
  )

  const [ color, setColor ] = useState<Color>(
    props.emojiIcon?.color || COLOR_PALETTE[0],
  )
  const [ emoji, setEmoji ] = useState<string>(props.emojiIcon?.emoji || '😉')

  const dialogRootProps = pick(props, DIALOG_ROOT_PROPS)

  const colorSquares = useMemo(
    () =>
      COLOR_PALETTE.map((c) => (
        <ColorSquare
          key={c}
          color={c}
          active={c === color}
          onClick={() => setColor(c)}
        />
      )),
    [ color, setColor ],
  )

  const open = props.open || internalOpen
  const handleOpenChange = props.onOpenChange || setInternalOpen

  const handleEmojiSelect = (emoji: EmojiMart.Emoji) => {
    setEmoji(emoji.native)
  }

  const handleDone = () => {
    onPick?.({ emoji, color })
    handleOpenChange(false)
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={handleOpenChange}
      {...dialogRootProps}
    >
      {children}

      <Dialog.Content
        align="start"
        className="EmojiIconPicker"
        srTitle="Create emoji icon"
        srDescription="Choose a color and an emoji to customize your icon. The selected
          combination will be used as the visual identifier."
        headerRightSide={
          <Button size="3" color="green" variant="soft" onClick={handleDone}>
            Done
          </Button>
        }
      >
        <div className="flex flex-col items-center gap-4 px-4">
          <EmojiIcon
            color={color}
            emoji={emoji}
            className="EmojiIconPicker__EmojiIcon"
          />

          <Tabs.Root defaultValue="color" className="w-full">
            <Tabs.List>
              <div className="grid w-full grid-cols-2">
                <Tabs.Trigger value="color">Select color</Tabs.Trigger>
                <Tabs.Trigger value="emoji">Select emoji</Tabs.Trigger>
              </div>
            </Tabs.List>

            <div className="pt-4">
              <Tabs.Content value="color" asChild>
                <div className="flex flex-wrap justify-center gap-2">
                  {colorSquares}
                </div>
              </Tabs.Content>

              <Tabs.Content value="emoji">
                <div className="flex justify-center">
                  <EmojiPicker
                    data={emojiData}
                    maxFrequentRows="1"
                    navPosition="bottom"
                    emojiButtonSize="42"
                    emojiSize="30"
                    perLine="7"
                    searchPosition="static"
                    onEmojiSelect={handleEmojiSelect}
                  />
                </div>
              </Tabs.Content>
            </div>
          </Tabs.Root>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}
