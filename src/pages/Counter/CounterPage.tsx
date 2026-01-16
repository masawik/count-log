import { Button, DropdownMenu, IconButton } from '@radix-ui/themes'
import { useUnit } from 'effector-react'
import { groupBy } from 'lodash-es'
import {
  ChevronLeft,
  Menu,
  RotateCw,
  SquarePen,
  TextCursorInput,
  Trash2,
} from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useOutletContext } from 'react-router'

import type { Counter } from '@/entities/counter'

import { useRafScheduler } from '@/shared/lib'
import { EmojiIcon } from '@/shared/ui'
import { AppDialog } from '@/shared/ui/AppDialog'

import {
  counterValueCorrected,
  deleteCounterConfirmed,
  deltaButtonClicked,
  resetCounterClicked,
  type CounterOutletContext,
} from './model'

const ExtraStepsContainer = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="flex flex-wrap content-start justify-between gap-1">
      {children}
    </div>
  )
}

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

  const [ showDeleteDialog, setShowDeleteDialog ] = useState(false)
  const [ isCorrectingMode, setIsCorrectingMode ] = useState(false)

  const correctionInputRef = useRef<HTMLInputElement | null>(null)
  const { schedule } = useRafScheduler()
  const handleEnableCorrectingMode = () => {
    // flushSync(() => {
    setIsCorrectingMode(true)
    // })

    schedule(() => {
      correctionInputRef.current?.focus()
    })
  }

  const handleSubmitCorrection = () => {
    const rawValue = correctionInputRef.current?.value
    if (!rawValue) return
    if (isNaN(+rawValue)) return

    const value = +rawValue

    handleCounterValueCorrected(value)
    setIsCorrectingMode(false)
  }

  const sortedSteps = useMemo(() => {
    return groupBy(counter.steps, ({ value }) =>
      value > 0 ? 'positive' : 'negative',
    ) as Record<'positive' | 'negative', Counter['steps']>
  }, [ counter ])

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

        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <IconButton variant="ghost" color="gray" size="3" className="m-0!">
              <Menu />
            </IconButton>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content size="2">
            <DropdownMenu.Item asChild className="text-4!">
              <Link to={`/edit-counter/${counter.id}`}>
                <SquarePen className="size-4" />
                Edit
              </Link>
            </DropdownMenu.Item>

            <DropdownMenu.Item
              color="red"
              className="text-4!"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="size-4" />
              Delete
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </header>

      {/* hero */}
      <div className="h-[30%] shrink-0 px-2 py-10">
        <div className="panel flex h-full items-center justify-center">
          <div
            className="relative text-9 font-bold"
            style={{ color: `var(--${counter.emojiIcon.color}-11)` }}
          >
            {isCorrectingMode ? (
              <div className="flex flex-col gap-4">
                <input
                  type="number"
                  defaultValue={counter.current_value}
                  className="w-full text-center outline-0"
                  ref={correctionInputRef}
                />

                <div className="flex justify-center gap-4">
                  <Button
                    variant="soft"
                    color="red"
                    size="4"
                    onClick={() => setIsCorrectingMode(false)}
                  >
                    Cancel
                  </Button>

                  <Button
                    variant="solid"
                    color="green"
                    size="4"
                    onClick={handleSubmitCorrection}
                  >
                    Confirm
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {counter.current_value}

                <IconButton
                  variant="soft"
                  radius="full"
                  color="gray"
                  className="absolute! top-0! right-0! translate-x-full! -translate-y-[50%]!"
                  onClick={handleEnableCorrectingMode}
                >
                  <TextCursorInput />
                </IconButton>
              </>
            )}
          </div>
        </div>
      </div>

      {/* main steps */}
      <div className="grid h-[20%] shrink-0 grid-cols-2 gap-3 px-2 py-2">
        {counter.steps.slice(0, 2).map(({ value }) => {
          const isPositive = value > 0

          return (
            <Button
              key={value}
              variant="soft"
              className="h-full!"
              color={isPositive ? 'grass' : 'pink'}
              onClick={() => handleDeltaButtonClicked(value)}
            >
              <span className="text-[32px]">
                {isPositive ? '+' : null}
                {value}
              </span>
            </Button>
          )
        })}
      </div>

      {/* extra steps */}
      <div className="overflow-auto">
        <div className="grid grid-cols-2 gap-3 px-2">
          <ExtraStepsContainer>
            {sortedSteps.negative.map(({ value }) => (
              <Button
                key={value}
                variant="outline"
                color="pink"
                size="2"
                className="grow!"
                onClick={() => handleDeltaButtonClicked(value)}
              >
                {value}
              </Button>
            ))}
          </ExtraStepsContainer>

          <ExtraStepsContainer>
            {sortedSteps.positive.map(({ value }) => (
              <Button
                key={value}
                variant="outline"
                color="grass"
                size="2"
                className="grow!"
                onClick={() => handleDeltaButtonClicked(value)}
              >
                +{value}
              </Button>
            ))}
          </ExtraStepsContainer>
        </div>
      </div>

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

      {showDeleteDialog && (
        <AppDialog
          title="Are you sure?"
          type="confirm"
          onClickNo={() => setShowDeleteDialog(false)}
          onClickYes={handleDeleteCounterConfirmed}
        >
          <AppDialog.DescriptionSlot>
            <div className="flex flex-col items-center gap-2">
              <div>Do you really want to delete this counter?</div>

              <div
                className="rounded-md p-1"
                style={{
                  backgroundColor: `var(--${counter.emojiIcon.color}-a3)`,
                }}
              >
                {counter.emojiIcon.emoji} {counter.name}
              </div>
            </div>
          </AppDialog.DescriptionSlot>
        </AppDialog>
      )}
    </main>
  )
}

export default CounterPage
