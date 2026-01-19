import { IconButton } from '@radix-ui/themes'
import { useGate, useUnit } from 'effector-react'
import { Plus } from 'lucide-react'
import { Link } from 'react-router'

import {
  $counters,
  $initialLoading,
  CounterListItem,
  countersListGate,
} from '@/widgets/CountersList'

import { FullPageLoader } from '@/shared/ui'

import { NoCountersPlaceholder } from './NoCountersPlaceholder'

export default function CountersListPage() {
  useGate(countersListGate)
  const counters = useUnit($counters)
  const loading = useUnit($initialLoading)

  if (loading) return <FullPageLoader />

  return (
    <main className="container grid h-fill grid-rows-[1fr_auto]">
      <div className="relative min-w-0">
        {!counters?.length && <NoCountersPlaceholder />}

        <div className="overflow-auto p-2">
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
          asChild
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
