import { IconButton } from '@radix-ui/themes'
import { Plus } from 'lucide-react'
import { Link } from 'react-router'

import { useGetCounters } from '@/entities/counter'

import { CounterListItem } from './CounterListItem'
import { NoCountersPlaceholder } from './NoCountersPlaceholder'

export default function CountersListPage() {
  const counters = useGetCounters()

  return (
    <main className="container grid h-fill grid-rows-[1fr_auto]">
      <div className="relative min-w-0">
        {!counters?.length && <NoCountersPlaceholder />}

        <div className="p-2 overflow-auto">
          <div className="flex flex-col gap-3">
            {counters?.map((c) => (
              <CounterListItem key={c.id} counter={c} />
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
