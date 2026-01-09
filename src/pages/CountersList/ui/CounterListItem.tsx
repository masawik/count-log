import { Button } from '@radix-ui/themes'

import type { Counter } from '@/entities/counter'
import { EmojiIcon } from '@/entities/EmojiIcon'

export interface CounterListItemProps {
  counter: Counter,
}

export const CounterListItem = ({ counter }: CounterListItemProps) => {
  return (
    <div className="panel flex items-start gap-2 p-2 max-w-full">
      <div className="flex grow flex-col gap-2 min-w-0">
        <div className="flex gap-2">
          <EmojiIcon className="size-8 rounded-2x shrink-0" {...counter.emojiIcon} />

          <span className="line-clamp-2 break-normal">{counter.name}</span>
        </div>

        {/* TODO value */}
        <div
          className="text-5 font-medium truncate"
          style={{ color: `var(--${counter.emojiIcon.color}-11)` }}
        >
          {counter.initial_value}
        </div>
      </div>

      <div className="flex gap-2 shrink-0">
        {counter.steps.slice(0, 2).map((step) => (
          <Button
            key={step.value}
            variant="soft"
            color={step.value > 0 ? 'grass' : 'pink'}
            className="rounded-xl!"
          >
            {step.value > 0 ? '+' : ''}
            {step.value}
          </Button>
        ))}
      </div>
    </div>
  )
}
