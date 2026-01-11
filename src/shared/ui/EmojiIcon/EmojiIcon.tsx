import { Slot, Spinner } from '@radix-ui/themes'

import { cn } from '@/shared/lib'

import type { EmojiIconType } from './types'

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
        'rounded-xl size-10 flex justify-center items-center relative @container overflow-hidden',
        { loading: loading },
        className,
      )}
      style={{
        backgroundColor: `var(--${color}-3)`,
      }}
      {...props}
    >
      <div className={
        cn(
          'text-[75cqw] transition-[filter]',
          { 'blur-xs': loading },
        )
      }>
        {emoji}
      </div>

      {loading && (
        <div className="absolute">
          <Spinner />
        </div>
      )}
    </Comp>
  )
}
