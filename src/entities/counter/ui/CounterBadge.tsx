import { cn } from '@/shared/lib'

import type { Counter } from '../model'

export interface CounterBadgeProps {
  counter: Counter,
  className?: string,
}

export const CounterBadge = ({ counter, className, ...props }: CounterBadgeProps & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn('rounded-md p-1', className)}
      style={{
        backgroundColor: `var(--${counter.emojiIcon.color}-a3)`,
      }}
      {...props}
    >
      {counter.emojiIcon.emoji} {counter.name}
    </div>
  )
}
