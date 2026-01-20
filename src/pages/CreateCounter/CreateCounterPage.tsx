import { Button } from '@radix-ui/themes'
import { useUnit } from 'effector-react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { FormProvider } from 'react-hook-form'
import { useNavigate } from 'react-router'


import type { NewCounter } from '@/entities/counter'

import { useAndroidBackButtonNavigate } from '@/shared/nativePlatform'
import { TextField } from '@/shared/ui'
import { EmojiIconInput } from '@/shared/ui/EmojiIconInput'

import { formSubmitted } from './model'

type FormInputs = NewCounter

export default function CounterEditorPage() {
  const handleSubmit = useUnit(formSubmitted)

  const navigate = useNavigate()

  useAndroidBackButtonNavigate('/')

  const formMethods = useForm<FormInputs>({
    defaultValues: {
      name: '',
      initial_value: 0,
      emojiIcon: {
        color: 'brown',
        emoji: '😒',
      },
    },
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

  const name = useWatch({
    control,
    name: 'name',
  })

  return (
    <main>
      <FormProvider {...formMethods}>
        <form
          onSubmit={formHandleSumbit(handleSubmit)}
          className="grid h-fill grid-rows-[1fr_auto]"
        >
          <div className="container overflow-auto px-2">
            <div className="flex justify-center p-4">
              <h1 className="text-6 font-normal">New counter</h1>
            </div>

            <div className="flex flex-col gap-4">
              <div className="panel">
                <div className="flex flex-col gap-2">
                  <div className="flex items-start gap-2">
                    <Controller
                      name="emojiIcon"
                      render={({ field }) => (
                        <EmojiIconInput suggestionText={name} {...field} />
                      )}
                    />

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
                    {...register('initial_value', {
                      required: true,
                      valueAsNumber: true,
                    })}
                  />
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
                Cancel
              </Button>

              <Button
                size="4"
                variant="solid"
                type="submit"
                disabled={isSubmitBtnDisabled}
              >
                Create
              </Button>
            </div>
          </footer>
        </form>
      </FormProvider>
    </main>
  )
}
