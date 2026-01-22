import { useUnit } from 'effector-react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import type { Counter } from '@/entities/counter'

import { Dialog, TextField } from '@/shared/ui'
import { EmojiIconInput } from '@/shared/ui/EmojiIconInput'

import {
  editCounterVisualDialogClosed,
  $counter,
  $isSubmitting,
  formSubmitted,
  type CounterVisualFields,
} from '../model'

const EditCounterVisualDialogImpl = ({ counter }: { counter: Counter }) => {
  const { t } = useTranslation()
  const handleClose = useUnit(editCounterVisualDialogClosed)
  const isSubmitting = useUnit($isSubmitting)
  const handleSubmit = useUnit(formSubmitted)

  const formData = useForm<CounterVisualFields>({
    defaultValues: {
      emojiIcon: { ...counter?.emojiIcon },
      name: counter?.name,
    },
  })

  const { register, handleSubmit: registerSubmitHandler } = formData

  return (
    <Dialog.Root open onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <Dialog.FormContent
        formData={formData}
        title={t('editing')}
        align="start"
        onSubmit={registerSubmitHandler(handleSubmit)}
        isSubmitting={isSubmitting}
        data-test-id="EditCounterVisualDialog"
      >
        <div className="flex items-start gap-2 p-4">
          <Controller
            name="emojiIcon"
            render={({ field }) => <EmojiIconInput {...field} />}
          />

          <TextField.Root
            label={t('counterName')}
            placeholder={t('counterNamePlaceholder')}
            className="grow"
            {...register('name', { required: true })}
          />
        </div>
      </Dialog.FormContent>
    </Dialog.Root>
  )
}

export const EditCounterVisualDialog = () => {
  const editingCounter = useUnit($counter)
  if (!editingCounter) return null

  return <EditCounterVisualDialogImpl counter={editingCounter} />
}
