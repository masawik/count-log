import { Button, IconButton } from '@radix-ui/themes'
import { useGate, useUnit } from 'effector-react'
import { Plus, Trash2, X } from 'lucide-react'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'

import type { Counter } from '@/entities/counter'

import { useRafScheduler } from '@/shared/lib'
import { Dialog, TextField } from '@/shared/ui'

import {
  $submitting,
  DeltaButtonsConfiguratorGate,
  formSubmitted,
} from '../model'

export type DeltaButtonsConfiguratorDialogProps = {
  counter: Counter,
} & Dialog.RootProps

type FormInputs = Pick<Counter, 'steps'>

const getInputNameByIndex = (index: number): `steps.${number}.value` =>
  `steps.${index}.value`

export const DeltaButtonsConfiguratorDialog = ({
  counter,
  ...props
}: DeltaButtonsConfiguratorDialogProps) => {
  useGate(DeltaButtonsConfiguratorGate, counter)
  const handleSubmit = useUnit(formSubmitted)
  const isSubmitting = useUnit($submitting)

  const formMethods = useForm<FormInputs>({
    defaultValues: {
      steps: [ ...counter.steps ],
    },
  })
  const {
    register,
    control,
    handleSubmit: registerSubmitHandler,
  } = formMethods

  const { fields, append, remove } = useFieldArray<FormInputs>({
    control,
    name: 'steps',
  })

  const [ lastNewStepInputName, setLastNewStepInputName ] = useState<
    null | string
  >(null)
  useLayoutEffect(() => {
    const newInputEl = document.querySelector(
      `[name="${lastNewStepInputName}"]`,
    ) as HTMLInputElement | undefined

    if (!newInputEl) return

    newInputEl.focus()
    newInputEl.select()
  }, [ lastNewStepInputName ])

  const { schedule } = useRafScheduler()
  const addStepButtonRef = useRef<null | HTMLButtonElement>(null)
  const handleAddStepButton = () => {
    const newItemIndex = fields.length
    append({ value: newItemIndex % 2 === 0 ? -1 : 1 })

    setLastNewStepInputName(getInputNameByIndex(newItemIndex))

    schedule(() => {
      addStepButtonRef.current?.scrollIntoView({
        block: 'nearest',
        behavior: 'instant',
      })
    })
  }

  const stepButtonInputs = useMemo(
    () =>
      fields.map((field, index) => {
        return (
          <TextField.Root
            key={field.id}
            type="number"
            {...register(getInputNameByIndex(index), {
              required: true,
              valueAsNumber: true,
            })}
          >
            {index > 1 && (
              <TextField.Slot side="right">
                <IconButton
                  variant="ghost"
                  color="gray"
                  type="button"
                  onClick={() => remove(index)}
                >
                  <Trash2 color="gray" />
                </IconButton>
              </TextField.Slot>
            )}
          </TextField.Root>
        )
      }),
    [ fields, register, remove ],
  )

  return (
    <Dialog.Root {...props}>
      <Dialog.Content
        align="start"
        className="grid max-h-[70dvh] grid-rows-[auto_1fr_auto] px-0!"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="grid grid-cols-[1fr_3fr_1fr] items-center justify-items-center px-4 pb-4">
          <Dialog.Close className="w-fit justify-self-start!">
            <IconButton
              size="3"
              variant="ghost"
              color="gray"
              disabled={isSubmitting}
            >
              <X />
            </IconButton>
          </Dialog.Close>

          <Dialog.Title className="m-0!">Configure steps</Dialog.Title>
        </div>

        <FormProvider {...formMethods}>
          <form
            onSubmit={registerSubmitHandler(handleSubmit)}
            className="flex min-h-0 flex-col"
          >
            <div className="grid w-full grid-cols-2 gap-2 overflow-auto p-4">
              {stepButtonInputs}
            </div>

            <div className="flex flex-col gap-4">
              <div className="mt-2 flex justify-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="3"
                  onClick={handleAddStepButton}
                  ref={addStepButtonRef}
                >
                  <Plus /> Add step
                </Button>
              </div>

              <div className="grid w-full grid-cols-2 items-center gap-2 px-4">
                <Dialog.Close>
                  <Button
                    size="4"
                    variant="ghost"
                    color="gray"
                    className="m-0!"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </Dialog.Close>

                <Button
                  variant="soft"
                  size="4"
                  color="grass"
                  type="submit"
                  loading={isSubmitting}
                >
                  Done
                </Button>
              </div>
            </div>
          </form>
        </FormProvider>
      </Dialog.Content>
    </Dialog.Root>
  )
}
