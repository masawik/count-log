import { IconButton } from '@radix-ui/themes'
import { Plus } from 'lucide-react'
import { Link } from 'react-router'

import { useGetCounters, type Counter } from '@/entities/counter'
import { createCounterEvent } from '@/entities/counterEvent'

import { CounterListItem } from './CounterListItem'
import { NoCountersPlaceholder } from './NoCountersPlaceholder'

export default function CountersListPage() {
  const { counters, update } = useGetCounters()

  const handleDeltaClick = async (counter: Counter, delta: number) => {
    await createCounterEvent({
      counter_id: counter.id,
      delta,
    })

    update()
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
