import { Button } from '@radix-ui/themes'
import { groupBy } from 'lodash-es'
import { memo, useMemo } from 'react'

import type { Counter } from '@/entities/counter'

import { cn } from '@/shared/lib'

export interface CounterDeltaButtonsProps {
  steps: Counter['steps'],
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

const CounterDeltaButtons = ({
  steps,
  onBtnClick,
  className,
}: CounterDeltaButtonsProps) => {
  const sortedSteps = useMemo(() => {
    return groupBy(steps, ({ value }) =>
      value > 0 ? 'positive' : 'negative',
    ) as Record<'positive' | 'negative', Counter['steps']>
  }, [ steps ])

  const hasNegatveExtraSteps = !!sortedSteps.negative?.length
  const hasPositiveExtraSteps = !!sortedSteps.positive?.length
  const hasExtraSteps = hasNegatveExtraSteps || hasPositiveExtraSteps

  return (
    <div className={className}>
      {/* main steps */}
      <div className="grid h-[20dvh] shrink-0 grid-cols-2 gap-3 px-2 py-2 min-h-fit">
        {steps.slice(0, 2).map(({ value }) => {
          const isPositive = value > 0

          return (
            <Button
              key={value}
              variant="soft"
              className="h-full!"
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
                {sortedSteps.negative.map(({ value }) => (
                  <Button
                    key={value}
                    variant="outline"
                    color="pink"
                    size="2"
                    className="grow!"
                    onClick={() => onBtnClick(value)}
                  >
                    {value}
                  </Button>
                ))}
              </ExtraStepsContainer>
            )}

            {hasPositiveExtraSteps && (
              <ExtraStepsContainer>
                {sortedSteps.positive.map(({ value }) => (
                  <Button
                    key={value}
                    variant="outline"
                    color="grass"
                    size="2"
                    className="grow!"
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
    </div>
  )
}

export default memo(CounterDeltaButtons)
