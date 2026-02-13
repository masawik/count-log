import { Button, IconButton } from '@radix-ui/themes'
import { TextCursorInput } from 'lucide-react'
import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { type Counter } from '@/entities/counter'

import { numCounterInputStep } from '@/shared/config'
import { useRafScheduler } from '@/shared/lib'

export interface EditableCounterPreviewProps {
  value: Counter['current_value'],
  color: string,
  onChange: (value: Counter['current_value']) => void,
}

const EditableCounterPreview = ({
  value,
  color,
  onChange,
}: EditableCounterPreviewProps) => {
  const { t } = useTranslation()
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

    onChange(value)
    setIsCorrectingMode(false)
  }

  return (
    <div className="panel py-6 flex h-full items-center justify-center" data-test-id="EditableCounterPreview">
      <div
        className="relative text-9 font-bold max-w-[80%]"
        style={{ color: `var(--${color}-11)` }}
      >
        {isCorrectingMode ? (
          <div className="flex flex-col gap-4">
            <input
              type="number"
              step={numCounterInputStep}
              defaultValue={value}
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
                {t('cancel')}
              </Button>

              <Button
                variant="solid"
                color="green"
                size="4"
                onClick={handleSubmitCorrection}
                data-test-id="EditableCounterPreview__submit"
              >
                {t('save')}
              </Button>
            </div>
          </div>
        ) : (
          <>
            {value}

            <IconButton
              variant="soft"
              radius="full"
              color="gray"
              className="absolute top-0 right-0 translate-x-full -translate-y-[50%]!"
              onClick={handleEnableCorrectingMode}
            >
              <TextCursorInput />
            </IconButton>
          </>
        )}
      </div>
    </div>
  )
}

export default EditableCounterPreview
