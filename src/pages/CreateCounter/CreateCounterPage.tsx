import { Button } from '@radix-ui/themes'
import { useUnit } from 'effector-react'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { type SubmitHandler, FormProvider } from 'react-hook-form'
import { useNavigate } from 'react-router'


import { useAndroidBackButtonNavigate } from '@/shared/nativePlatform'
import { EmojiIcon, EmojiIconPicker } from '@/shared/ui'
import { TextField } from '@/shared/ui'

import { useEmojiIcon } from './lib/useEmojiIcon'
import { formSubmitted } from './model'

interface FormInputs {
  name: string,
  initialValue: number,
}

export default function CounterEditorPage() {
  const handleFormSubmit = useUnit(formSubmitted)

  const navigate = useNavigate()

  useAndroidBackButtonNavigate('/')

  const formMethods = useForm<FormInputs>({
    defaultValues: {
      name: '',
      initialValue: 0,
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
  const handleSubmit: SubmitHandler<FormInputs> = (data) => {
    handleFormSubmit({
      name: data.name,
      initial_value: data.initialValue,
      emojiIcon: emojiIcon,
    })
  }

  const name = useWatch({
    control,
    name: 'name',
  })

  const {
    emojiIcon,
    loading: searchingEmoji,
    handlePickEmojiIcon,
  } = useEmojiIcon(name)
  const [ emojiPickerVisible, setEmojiPickerVisible ] = useState(false)


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
