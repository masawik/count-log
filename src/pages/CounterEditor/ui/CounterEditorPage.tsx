import {
  Button,
  Grid,
  Heading,
  IconButton,
  Text,
} from '@radix-ui/themes'
import { Plus, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { type SubmitHandler, FormProvider } from 'react-hook-form'

import { EmojiIconPicker } from '@/features/EmojiIconPicker'

import { EmojiIcon, type EmojiIconType } from '@/entities/EmojiIcon'

import { InputWrapper, TextArea, TextField } from '@/shared/ui'

import { useEmojiIcon } from '../lib/useEmojiIcon'

interface FormInputs {
  emojiIcon: EmojiIconType,
  name: string,
  description: string,
  initialValue: number,
  stepButtons: { value: number }[],
}

export default function CounterEditorPage() {
  const formMethods = useForm<FormInputs>({
    defaultValues: {
      name: '',
      description: '',
      initialValue: 0,
      stepButtons: [ { value: -1 }, { value: 1 } ],
    },
    shouldUnregister: true,
    shouldUseNativeValidation: true,
    mode: 'onSubmit',
  })

  const {
    register,
    handleSubmit: formHandleSumbit,
    watch,
    control,
    formState: { errors },
  } = formMethods

  const isSubmitBtnDisabled = !!Object.keys(errors).length
  const handleSubmit: SubmitHandler<FormInputs> = (data) => console.log(data)

  const { fields, append, remove } = useFieldArray<FormInputs>({
    control,
    name: 'stepButtons',
  })

  const name = watch('name', '')

  const {
    emojiIcon,
    loading: searchingEmoji,
    handlePickEmojiIcon,
  } = useEmojiIcon(name)
  const [ emojiPickerVisible, setEmojiPickerVisible ] = useState(false)

  const handleAddStepButton = () =>
    append(
      { value: 1 },
      {
        shouldFocus: true,
        focusName: `stepButtons.${fields.length}`,
      },
    )

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
        <Grid asChild rows="1fr auto" height="100vh">
          <form onSubmit={formHandleSumbit(handleSubmit)}>
            <div className="container overflow-auto px-2">
              <div className="p-4 flex justify-center">
                <Heading size="6" weight="medium">
                  New counter
                </Heading>
              </div>

              <div className="flex flex-col gap-4">
                <div className="panel">
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2 items-start">
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

                    <TextArea
                      resize="none"
                      placeholder="Books to read over the summer..."
                      {...register('description')}
                    >
                      <InputWrapper.Label>
                        <Text>
                          description{' '}
                          <Text size="1" color="gray">
                            (optional)
                          </Text>
                        </Text>
                      </InputWrapper.Label>
                    </TextArea>
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
                        <Text as="div">Step buttons</Text>
                        <Text as="div" weight="regular" size="1" color="brown">
                          The first two buttons will be displayed on the main
                          page.
                        </Text>
                      </div>

                      <Grid
                        columns="2"
                        width="100%"
                        gap="2"
                        data-test-id="step-buttons-container"
                      >
                        {stepButtonInputs}
                      </Grid>

                      <div className="mt-2 flex justify-center">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={handleAddStepButton}
                        >
                          <Plus /> Add button
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="container border-t border-(--gray-6) p-2">
              <Grid align="center" width="100%" columns="2" gap="1">
                <Button
                  size="4"
                  variant="ghost"
                  color="gray"
                  className="mx-0! py-3!"
                  type="button"
                >
                  cancel
                </Button>

                <Button
                  size="4"
                  variant="solid"
                  type="submit"
                  disabled={isSubmitBtnDisabled}
                >
                  Create
                </Button>
              </Grid>
            </div>
          </form>
        </Grid>
      </FormProvider>
    </main>
  )
}
