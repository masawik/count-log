import { useGate, useList, useUnit } from 'effector-react'

import {
  $counters,
  $initialLoading,
  CounterListItem,
  CountersListGate,
} from '@/widgets/CountersList'

import { useAndroidBackButtonExitApp } from '@/shared/nativePlatform'
import { FullPageLoader } from '@/shared/ui'

import { NoCountersPlaceholder } from './NoCountersPlaceholder'
import { PlusBtn } from './PlusBtn/PlusBtn'

export function CountersListPage() {
  useAndroidBackButtonExitApp()

  useGate(CountersListGate)
  const loading = useUnit($initialLoading)
  const counters = useUnit($counters)

  const counterItems = useList($counters, {
    getKey: ({ id }) => id,
    fn: (counter) => <CounterListItem counter={counter} />,
    placeholder: <NoCountersPlaceholder />,
  })

  if (loading) return <FullPageLoader />

  return (
    <main className="container grid h-fill grid-rows-[1fr_auto]">
      <div className="relative min-w-0">
        <div className="h-full overflow-auto p-2">
          <ul className="flex h-full flex-col gap-3 pb-24">{counterItems}</ul>
        </div>

        <PlusBtn showArrow={!counters.length} />
      </div>
    </main>
  )
}
