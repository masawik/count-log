import { Button, IconButton } from '@radix-ui/themes'
import { useUnit } from 'effector-react'
import { RotateCw, ScrollText, Timer } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useOutletContext } from 'react-router'

import { CounterDeltaButtons } from '@/widgets/CounterDeltaButtons'
import { CounterHeader } from '@/widgets/CounterHeader'

import { counterValueCorrected } from '@/features/changeCounterValue'
import {
  EditCounterVisualDialog,
  editCounterVisualDialogOpened,
} from '@/features/EditCounterVisual'

import type { Counter } from '@/entities/counter'

import { useAndroidBackButtonNavigate } from '@/shared/nativePlatform'
import { StopWatch } from '@/shared/ui'

import {
  deleteCounterConfirmed,
  deltaButtonClicked,
  resetCounterClicked,
} from './model'
import CounterMenu from './ui/CounterMenu'
import EditableCounterPreview from './ui/EditableCounterPreview'

import type { CounterOutletContext } from '../CounterRouteLayout'

export const CounterPage = () => {
  const { t } = useTranslation()
  const { counter } = useOutletContext<CounterOutletContext>()
  const [ stopWatchVisible, setStopWatchVisible ] = useState<boolean>(false)
  useAndroidBackButtonNavigate('/')

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
  const openEditDialog = useUnit(editCounterVisualDialogOpened)
  const handleEdit = () => openEditDialog(counter)

  const onCorrectValue = useCallback(
    (targetValue: Counter['current_value']) => {
      handleCounterValueCorrected({
        id: counter.id,
        targetValue,
      })
    },
    [ handleCounterValueCorrected, counter.id ],
  )

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
              onEdit={handleEdit}
            />
          </div>
        }
      />

      <main className="flex grow flex-col overflow-auto">
        <div className="h-[40%] min-h-fit shrink-0 px-2 py-10">
          <EditableCounterPreview
            value={counter.current_value}
            color={counter.emojiIcon.color}
            onChange={onCorrectValue}
          />
        </div>

        <CounterDeltaButtons
          counter={counter}
          onBtnClick={handleDeltaButtonClicked}
          className="grow"
        />

        {stopWatchVisible && (
          <div className="flex justify-center p-4">
            <StopWatch />
          </div>
        )}

        <EditCounterVisualDialog />
      </main>

      <footer className="width-full grid grid-cols-1 grid-rows-2 gap-2 px-2 py-4">
        <Button
          variant="outline"
          color="red"
          size="3"
          onClick={handleResetCounterClicked}
        >
          <RotateCw className="size-4" />
          {t('reset')}
        </Button>

        <Button
          variant="outline"
          color="gray"
          size="3"
          onClick={() => setStopWatchVisible((s) => !s)}
        >
          <Timer className="size-4" />
          {stopWatchVisible ? t('hideStopWatch') : t('showStopWatch')}
        </Button>
      </footer>
    </div>
  )
}


