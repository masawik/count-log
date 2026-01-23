import { Spinner } from '@radix-ui/themes'
import { useGate, useUnit } from 'effector-react'
import { useTranslation } from 'react-i18next'
import { useOutletContext } from 'react-router'

import { CounterHeader } from '@/widgets/CounterHeader'

import { useAndroidBackButtonNavigate } from '@/shared/nativePlatform'

import { $events, $loading, $noContent, ConuterHistoryPageGate } from './model'
import { EventListItem } from './ui/EventListItem'

import type { CounterOutletContext } from '../CounterRouteLayout'

export const CounterHistoryPage = () => {
  const { t } = useTranslation()
  const { counter } = useOutletContext<CounterOutletContext>()
  useGate(ConuterHistoryPageGate, counter)

  const backUrl = `/counter/${counter.id}`
  useAndroidBackButtonNavigate(backUrl)

  const events = useUnit($events)
  const isLoading = useUnit($loading)
  const noContent = useUnit($noContent)

  return (
    <main className="flex h-fill flex-col">
      <CounterHeader counter={counter} backLink={{ to: backUrl }} />

      {isLoading ? (
        <div className="flex justify-center py-14">
          <Spinner />
        </div>
      ) : noContent ? (
        <div className="flex flex-col items-center gap-2 py-14 text-6 text-grayA-11">
          {t('noEventsYet')}
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
