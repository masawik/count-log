import { Button, IconButton } from '@radix-ui/themes'
import { useUnit } from 'effector-react'
import { Plus, Trash2 } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { type SubmitHandler, FormProvider } from 'react-hook-form'
import { useNavigate } from 'react-router'

import { getCounterFx, type Counter } from '@/entities/counter'

import { useRafScheduler } from '@/shared/lib'
import { EmojiIcon, EmojiIconPicker } from '@/shared/ui'
import { TextField } from '@/shared/ui'

import { useEmojiIcon } from '../lib/useEmojiIcon'
import { formSubmitted } from '../model'

import type { Route } from './+types/CounterEditorPage'

interface FormInputs {
  name: string,
  initialValue: number,
  stepButtons: { value: number }[],
}

export const clientLoader = async ({ params }: Route.ClientLoaderArgs) => {
  if (!params.counterId) {
    return {
      counter: undefined,
    }
  }

  // FIX remove direct fx usage
  const counter = await getCounterFx({ id: params.counterId })
  return { counter }
}

const getFormDefaultValue = (counter?: Counter) => {
  const stepButtons = counter?.steps
    ? [ ...counter.steps ]
    : [ { value: -1 }, { value: 1 } ]

  return {
    name: counter?.name || '',
    initialValue: counter?.initial_value || 0,
    stepButtons,
  }
}

export default function CounterEditorPage({
  loaderData: { counter },
}: Route.ComponentProps) {
  const isNew = !counter

  const handleFormSubmit = useUnit(formSubmitted)

  const navigate = useNavigate()

  const formMethods = useForm<FormInputs>({
    defaultValues: getFormDefaultValue(counter),
    shouldUnregister: true,
    mode: 'onSubmit',
  })

  const {
    register,
    handleSubmit: formHandleSumbit,
    control,
    formState: { errors },
  } = formMethods

  const isSubmitBtnDisabled = !!Object.keys(errors).length
  const handleSubmit: SubmitHandler<FormInputs> = async (data) => {
    const update = {
      name: data.name,
      initial_value: data.initialValue,
      steps: data.stepButtons,
      emojiIcon: emojiIcon,
    }

    handleFormSubmit({
      update,
      counter,
    })
  }

  const { fields, append, remove } = useFieldArray<FormInputs>({
    control,
    name: 'stepButtons',
  })

  const name = useWatch({
    control,
    name: 'name',
  })

  const {
    emojiIcon,
    loading: searchingEmoji,
    handlePickEmojiIcon,
  } = useEmojiIcon(name, {
    shouldNotSuggest: !isNew,
    initialValue: counter?.emojiIcon,
  })
  const [ emojiPickerVisible, setEmojiPickerVisible ] = useState(false)

  const { schedule } = useRafScheduler()
  const addStepButtonRef = useRef<null | HTMLButtonElement>(null)
  const handleAddStepButton = () => {
    append(
      { value: 1 },
      {
        shouldFocus: true,
        focusName: `stepButtons.${fields.length}`,
      },
    )

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
            {...register(`stepButtons.${index}.value`, {
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
    <main>
      <FormProvider {...formMethods}>
        <form
          onSubmit={formHandleSumbit(handleSubmit)}
          className="grid h-fill grid-rows-[1fr_auto]"
        >
          <div className="container overflow-auto px-2">
            <div className="flex justify-center p-4">
              <h1 className="text-6 font-normal">
                {isNew ? 'New counter' : 'Editing'}
              </h1>
            </div>

            <div className="flex flex-col gap-4">
              <div className="panel">
                <div className="flex flex-col gap-2">
                  <div className="flex items-start gap-2">
                    <button
                      onClick={() => setEmojiPickerVisible(true)}
                      type="button"
                      aria-label="Edit icon"
                    >
                      <EmojiIcon
                        emoji={emojiIcon.emoji}
                        color={emojiIcon.color}
                        className="size-17"
                        loading={searchingEmoji}
                      />
                    </button>

                    {emojiPickerVisible && (
                      <EmojiIconPicker
                        emojiIcon={emojiIcon}
                        open
                        onOpenChange={setEmojiPickerVisible}
                        onPick={handlePickEmojiIcon}
                      />
                    )}

                    <TextField.Root
                      label="name"
                      placeholder="books read"
                      className="grow"
                      {...register('name', { required: true })}
                    />
                  </div>
                </div>
              </div>

              <div className="panel">
                <div className="flex flex-col gap-2">
                  <TextField.Root
                    label="Initial value"
                    type="number"
                    {...register('initialValue', {
                      required: true,
                      valueAsNumber: true,
                    })}
                  />

                  <div className="flex flex-col gap-2">
                    <div>
                      <div>Step buttons</div>
                      <div className="text-1 text-brownA-11">
                        The first two buttons will be displayed on the main
                        page.
                      </div>
                    </div>

                    <div
                      className="grid w-full grid-cols-2 gap-2"
                      data-test-id="step-buttons-container"
                    >
                      {stepButtonInputs}
                    </div>

                    <div className="mt-2 flex justify-center">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleAddStepButton}
                        ref={addStepButtonRef}
                      >
                        <Plus /> Add button
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <footer className="container border-t border-(--gray-6) p-2">
            <div className="grid w-full grid-cols-2 items-center gap-1">
              <Button
                size="4"
                variant="ghost"
                color="gray"
                className="mx-0! py-3!"
                type="button"
                onClick={() => navigate('/')}
              >
                cancel
              </Button>

              <Button
                size="4"
                variant="solid"
                type="submit"
                disabled={isSubmitBtnDisabled}
              >
                {isNew ? 'create' : 'save'}
              </Button>
            </div>
          </footer>
        </form>
      </FormProvider>
    </main>
  )
}
