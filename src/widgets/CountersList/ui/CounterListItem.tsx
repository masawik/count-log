import { Button } from '@radix-ui/themes'
import { useUnit } from 'effector-react'
import { useMemo } from 'react'
import { Link } from 'react-router'

import { changeCounterValueByDelta } from '@/features/changeCounterValue'

import type { Counter } from '@/entities/counter'

import { EmojiIcon } from '@/shared/ui'

export interface CounterListItemProps {
  counter: Counter,
}

export const CounterListItem = ({ counter }: CounterListItemProps) => {
  const handleDeltaClick = useUnit(changeCounterValueByDelta)

  const stepButtons = useMemo(
    () =>
      counter.steps.slice(0, 2).map((step) => {
        const isPositive = step.value > 0

        return (
          <Button
            key={step.value}
            variant="soft"
            color={isPositive ? 'grass' : 'pink'}
            className="rounded-xl"
            onClick={() =>
              handleDeltaClick({
                counter_id: counter.id,
                delta: step.value,
              })
            }
          >
            {isPositive ? '+' : ''}
            {step.value}
          </Button>
        )
      }),
    [ handleDeltaClick, counter ],
  )

  return (
    <div className="panel flex max-w-full items-start gap-2 p-2">
      <div className="flex min-w-0 grow flex-col gap-2">
        <Link to={`/counter/${counter.id}`} className="flex gap-2">
          <EmojiIcon
            className="rounded-2x size-8 shrink-0"
            {...counter.emojiIcon}
          />

          <span className="line-clamp-2 break-normal">{counter.name}</span>
        </Link>

        <div
          className="truncate text-5 font-medium"
          style={{ color: `var(--${counter.emojiIcon.color}-11)` }}
        >
          {counter.current_value}
        </div>
      </div>

      <div className="flex shrink-0 gap-2">{stepButtons}</div>
    </div>
  )
}
