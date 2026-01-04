import { Slot, Spinner } from '@radix-ui/themes'

import { cn } from '@/shared/lib'

import s from './EmojiIcon.module.css'

import type { EmojiIconType } from '../model'

export type EmojiIconProps = React.HTMLAttributes<HTMLElement> &
  EmojiIconType & {
    asChild?: boolean,
    loading?: boolean,
  }

export function EmojiIcon({
  asChild,
  emoji,
  color,
  className,
  loading,
  ...props
}: EmojiIconProps) {
  const Comp = asChild ? Slot : 'div'

  return (
    <Comp
      className={cn(
        'rounded-xl size-10 flex justify-center items-center relative',
        s.container,
        className,
      )}
      style={{
        backgroundColor: `var(--${color}-3)`,
      }}
      {...props}
    >
      <div className={s.emoji}>{emoji}</div>

      {loading && (
        <div className={s.loader}>
          <Spinner />
        </div>
      )}
    </Comp>
  )
}
