import { IconButton } from '@radix-ui/themes'
import { useUnit } from 'effector-react'
import { Plus } from 'lucide-react'
import { Link } from 'react-router'

import { counterValueChangedByDelta as counterDeltaButtonClickedEvent } from '@/features/changeCounterValue'

import { $counters } from '@/entities/counter'

import { CounterListItem } from './CounterListItem'
import { NoCountersPlaceholder } from './NoCountersPlaceholder'

export default function CountersListPage() {
  const counters = useUnit($counters)

  const counterDeltaButtonClicked = useUnit(counterDeltaButtonClickedEvent)

  return (
    <main className="container grid h-fill grid-rows-[1fr_auto]">
      <div className="relative min-w-0">
        {!counters?.length && <NoCountersPlaceholder />}

        <div className="overflow-auto p-2">
          <div className="flex flex-col gap-3">
            {counters?.map((c) => (
              <CounterListItem
                key={c.id}
                counter={c}
                onDeltaClick={(delta) =>
                  counterDeltaButtonClicked({ counter_id: c.id, delta })
                }
              />
            ))}
          </div>
        </div>

        <IconButton
          size="4"
          variant="solid"
          radius="full"
          className="fixed! right-6! bottom-6!"
        >
          <Link to="/edit-counter">
            <Plus />
          </Link>
        </IconButton>
      </div>
    </main>
  )
}
