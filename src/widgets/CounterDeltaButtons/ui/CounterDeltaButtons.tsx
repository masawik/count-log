import { Button, IconButton } from '@radix-ui/themes'
import { useGate, useUnit } from 'effector-react'
import { groupBy } from 'lodash-es'
import { Settings } from 'lucide-react'
import { useMemo } from 'react'

import { DeltaButtonsConfiguratorDialog } from '@/features/DeltaButtonsConfigurator'

import type { Counter } from '@/entities/counter'

import { cn } from '@/shared/lib'

import {
  $isConfiguratorDialogOpened,
  configuratorDialogClosed,
  configuratorDialogOpened,
  CounterDeltaButtonsGate,
} from '../model'

export interface CounterDeltaButtonsProps {
  counter: Counter,
  onBtnClick: (value: Counter['steps'][number]['value']) => void,
  className?: string,
}

const ExtraStepsContainer = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="flex flex-wrap content-start justify-between gap-1">
      {children}
    </div>
  )
}

export const CounterDeltaButtons = ({
  counter,
  onBtnClick,
  className,
}: CounterDeltaButtonsProps) => {
  useGate(CounterDeltaButtonsGate, counter)
  const { steps } = counter

  const isConfiguratorDialogOpened = useUnit($isConfiguratorDialogOpened)
  const [ openDialog, closeDialog ] = useUnit([
    configuratorDialogOpened,
    configuratorDialogClosed,
  ])

  const sortedExtraSteps = useMemo(() => {
    return groupBy(steps.slice(2), ({ value }) =>
      value > 0 ? 'positive' : 'negative',
    ) as Record<'positive' | 'negative', Counter['steps']>
  }, [ steps ])

  const hasNegatveExtraSteps = !!sortedExtraSteps.negative?.length
  const hasPositiveExtraSteps = !!sortedExtraSteps.positive?.length
  const hasExtraSteps = hasNegatveExtraSteps || hasPositiveExtraSteps

  return (
    <div className={cn(className)}>
      <div className="flex justify-end px-2">
        <IconButton
          variant="ghost"
          color="gray"
          className="m-0"
          onClick={openDialog}
        >
          <Settings className="size-6" />
        </IconButton>
      </div>

      {/* main steps */}
      <div className="grid h-[20dvh] min-h-fit shrink-0 grid-cols-2 gap-3 px-2 py-2">
        {steps.slice(0, 2).map(({ value }) => {
          const isPositive = value > 0

          return (
            <Button
              key={value}
              variant="soft"
              className="h-full"
              color={isPositive ? 'grass' : 'pink'}
              onClick={() => onBtnClick(value)}
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
      {hasExtraSteps && (
        <div className="overflow-auto">
          <div
            className={cn(
              'grid gap-3 px-2',
              hasNegatveExtraSteps && hasPositiveExtraSteps
                ? 'grid-cols-2'
                : 'grid-cols-1',
            )}
          >
            {hasNegatveExtraSteps && (
              <ExtraStepsContainer>
                {sortedExtraSteps.negative.map(({ value }) => (
                  <Button
                    key={value}
                    variant="outline"
                    color="pink"
                    size="2"
                    className="grow"
                    onClick={() => onBtnClick(value)}
                  >
                    {value}
                  </Button>
                ))}
              </ExtraStepsContainer>
            )}

            {hasPositiveExtraSteps && (
              <ExtraStepsContainer>
                {sortedExtraSteps.positive.map(({ value }) => (
                  <Button
                    key={value}
                    variant="outline"
                    color="grass"
                    size="2"
                    className="grow"
                    onClick={() => onBtnClick(value)}
                  >
                    +{value}
                  </Button>
                ))}
              </ExtraStepsContainer>
            )}
          </div>
        </div>
      )}

      {isConfiguratorDialogOpened && (
        <DeltaButtonsConfiguratorDialog
          open
          counter={counter}
          onOpenChange={closeDialog}
        />
      )}
    </div>
  )
}
