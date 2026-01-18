import { ArrowRight } from 'lucide-react'

import type { CounterEvent } from '@/entities/counterEvent'

import { dayjs, FULLDATETIME_FORMAT } from '@/shared/datetime'
import { cn } from '@/shared/lib'
import { isFalsyExceptZero } from '@/shared/lib/utils'

export interface EventListItemProps {
  event: CounterEvent,
}

const formatFullTime = (date: Date) => {
  return dayjs(date).format(FULLDATETIME_FORMAT)
}

export const EventListItem = ({ event }: EventListItemProps) => {
  const prevValue = !isFalsyExceptZero(event.current_value)
    ? event.current_value - event.delta
    : undefined

  return (
    <div className="flex items-start justify-between border-b border-gray-6 px-2">
      <div className="flex flex-col gap-2">
        <div className="text-3 text-grayA-11">
          {formatFullTime(event.created_at)}
        </div>

        {
          event.note && (
            <div className={cn({
              'text-pinkA-11': event.note === 'reset',
              'text-orangeA-11': event.note === 'correction',
            })}>{event.note}</div>
          )
        }
      </div>

      <div className="flex flex-col items-end gap-2">
        <div
          className={cn(
            'font-medium',
            event.delta > 0 ? 'text-grassA-11' : 'text-pinkA-11',
          )}
        >
          {event.delta}
        </div>

        {prevValue !== undefined && (
          <div className="flex items-center gap-2 text-4">
            <div className="contents text-grayA-11">
              <div>{prevValue}</div>
              <ArrowRight className="size-4" />
            </div>

            <div className="font-medium">{event.current_value}</div>
          </div>
        )}
      </div>
    </div>
  )
}
