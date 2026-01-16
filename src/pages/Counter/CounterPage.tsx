import { Button, IconButton } from '@radix-ui/themes'
import { useUnit } from 'effector-react'
import { ChevronLeft, RotateCw } from 'lucide-react'
import { useMemo } from 'react'
import { Link, useOutletContext } from 'react-router'

import { EmojiIcon } from '@/shared/ui'

import {
  counterValueCorrected,
  deleteCounterConfirmed,
  deltaButtonClicked,
  resetCounterClicked,
  type CounterOutletContext,
} from './model'
import CounterDeltaButtons from './ui/CounterDeltaButtons'
import CounterMenu from './ui/CounterMenu'
import EditableCounterPreview from './ui/EditableCounterPreview'

const CounterPage = () => {
  const { counter } = useOutletContext<CounterOutletContext>()

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
    <main className="container flex h-fill flex-col">
      <header className="flex items-center gap-2 p-3 px-2">
        <Link to="/">
          <IconButton variant="ghost" color="gray" size="3" className="m-0!">
            <ChevronLeft />
          </IconButton>
        </Link>

        <div className="flex grow items-center justify-center gap-2">
          <EmojiIcon {...counter.emojiIcon} className="rounded-full" />

          <h1>{counter.name}</h1>
        </div>

        <CounterMenu
          counter={counter}
          onDelete={handleDeleteCounterConfirmed}
        />
      </header>

      <div className="h-[30%] shrink-0 px-2 py-10">
        <EditableCounterPreview
          value={counter.current_value}
          color={counter.emojiIcon.color}
          onChange={handleCounterValueCorrected}
        />
      </div>

      <CounterDeltaButtons
        steps={steps}
        onBtnClick={handleDeltaButtonClicked}
      />

      <footer className="width-full mt-auto grid grid-cols-1 grid-rows-1 gap-2 px-2 py-4">
        <Button
          variant="outline"
          color="red"
          size="3"
          onClick={handleResetCounterClicked}
        >
          <RotateCw className="size-4" />
          reset
        </Button>

        {/* <Button variant="outline" color="gray" size="3">
          <Timer className="size-4" />
          show stopwatch
        </Button>

        <Button variant="outline" color="gray" size="3">
          <ScrollText className="size-4" />
          history
        </Button>

        <Button variant="outline" color="gray" size="3">
          <ChartColumn className="size-4" />
          analytics
        </Button> */}
      </footer>
    </main>
  )
}

export default CounterPage
