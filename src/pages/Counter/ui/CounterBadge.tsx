import type { Counter } from '@/entities/counter'

import { cn } from '@/shared/lib'

export interface CounterBadgeProps {
  counter: Counter,
  className?: string,
}

export const CounterBadge = ({ counter, className }: CounterBadgeProps) => {
  return (
    <div
      className={cn('rounded-md p-1', className)}
      style={{
        backgroundColor: `var(--${counter.emojiIcon.color}-a3)`,
      }}
    >
      {counter.emojiIcon.emoji} {counter.name}
    </div>
  )
}
