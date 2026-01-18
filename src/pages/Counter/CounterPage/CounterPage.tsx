import { Button, IconButton } from '@radix-ui/themes'
import { useUnit } from 'effector-react'
import { RotateCw, ScrollText, Timer } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useOutletContext } from 'react-router'

import { CounterHeader } from '@/widgets/CounterHeader'

import { StopWatch } from '@/shared/ui'

import {
  counterValueCorrected,
  deleteCounterConfirmed,
  deltaButtonClicked,
  resetCounterClicked,
} from './model'
import CounterDeltaButtons from './ui/CounterDeltaButtons'
import CounterMenu from './ui/CounterMenu'
import EditableCounterPreview from './ui/EditableCounterPreview'

import type { CounterOutletContext } from '../CounterRouteLayout'

const CounterPage = () => {
  const { counter } = useOutletContext<CounterOutletContext>()
  const [ stopWatchVisible, setStopWatchVisible ] = useState<boolean>(false)

  const {
    handleDeleteCounterConfirmed,
    handleResetCounterClicked,
    handleCounterValueCorrected,
    handleDeltaButtonClicked,
  } = useUnit({
    handleDeleteCounterConfirmed: deleteCounterConfirmed,
    handleResetCounterClicked: resetCounterClicked,
    handleCounterValueCorrected: counterValueCorrected,
    handleDeltaButtonClicked: deltaButtonClicked,
  })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const steps = useMemo(() => counter.steps, [ counter.id ])

  return (
    <div className="container flex h-fill flex-col">
      <CounterHeader
        counter={counter}
        backLink={{ to: '/' }}
        rightSide={
          <div className="flex items-center gap-3">
            <Link to="history">
              <IconButton size="3" variant="ghost" color="gray">
                <ScrollText />
              </IconButton>
            </Link>

            <CounterMenu
              counter={counter}
              onDelete={handleDeleteCounterConfirmed}
            />
          </div>
        }
      />

      <main className="flex grow flex-col overflow-auto">
        <div className="h-[30%] min-h-fit shrink-0 px-2 py-10">
          <EditableCounterPreview
            value={counter.current_value}
            color={counter.emojiIcon.color}
            onChange={handleCounterValueCorrected}
          />
        </div>

        <CounterDeltaButtons
          steps={steps}
          onBtnClick={handleDeltaButtonClicked}
          className="grow"
        />

        {stopWatchVisible && (
          <div className="flex justify-center p-4">
            <StopWatch />
          </div>
        )}
      </main>

      <footer className="width-full grid grid-cols-1 grid-rows-2 gap-2 px-2 py-4">
        <Button
          variant="outline"
          color="red"
          size="3"
          onClick={handleResetCounterClicked}
        >
          <RotateCw className="size-4" />
          reset
        </Button>

        <Button
          variant="outline"
          color="gray"
          size="3"
          onClick={() => setStopWatchVisible((s) => !s)}
        >
          <Timer className="size-4" />
          {stopWatchVisible ? 'hide' : 'show'} stopwatch
        </Button>
      </footer>
    </div>
  )
}

export default CounterPage
