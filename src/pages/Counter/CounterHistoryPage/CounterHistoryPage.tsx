import { Spinner } from '@radix-ui/themes'
import { useGate, useUnit } from 'effector-react'
import { useOutletContext } from 'react-router'

import { CounterHeader } from '@/widgets/CounterHeader'

import { $events, $loading, conuterHistoryPageGate } from './model'
import { EventListItem } from './ui/EventListItem'

import type { CounterOutletContext } from '../CounterRouteLayout'


const CounterHistoryPage = () => {
  const { counter } = useOutletContext<CounterOutletContext>()
  useGate(conuterHistoryPageGate, counter)

  const events = useUnit($events)
  const isLoading = useUnit($loading)

  return (
    <main className="flex h-fill flex-col">
      <CounterHeader
        counter={counter}
        backLink={{ to: `/counter/${counter.id}` }}
      />

      {isLoading || events === null ? (
        <div className="flex justify-center py-14">
          <Spinner />
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center gap-2 text-6 text-grayA-11 py-14">
         there is no events yet.
        </div>
      ) : (
        <div className="panel flex grow flex-col gap-1 overflow-auto rounded-b-none">
          {events.map((e) => (
            <EventListItem key={e.id} event={e} />
          ))}
        </div>
      )}
    </main>
  )
}

export default CounterHistoryPage
