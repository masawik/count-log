import { IconButton } from '@radix-ui/themes'
import { useUnit } from 'effector-react'
import { Plus } from 'lucide-react'
import { Link } from 'react-router'

import { addCounterEvent } from '@/features/AddCounterEvent'

import { type Counter } from '@/entities/counter'
import { $counters } from '@/entities/counter'

import { CounterListItem } from './CounterListItem'
import { NoCountersPlaceholder } from './NoCountersPlaceholder'

export default function CountersListPage() {
  const counters = useUnit($counters)

  const handleDeltaClick = async (counter: Counter, delta: number) => {
    await addCounterEvent({
      counter_id: counter.id,
      delta,
    })
  }

  return (
    <main className="container grid h-fill grid-rows-[1fr_auto]">
      <div className="relative min-w-0">
        {!counters?.length && <NoCountersPlaceholder />}

        <div className="p-2 overflow-auto">
          <div className="flex flex-col gap-3">
            {counters?.map((c) => (
              <CounterListItem
                key={c.id}
                counter={c}
                onDeltaClick={(d) => handleDeltaClick(c, d)}
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
