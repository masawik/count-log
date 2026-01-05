import {
  TextArea as RadixTextArea,
  type TextAreaProps,
} from '@radix-ui/themes'

import { withInputWrapper } from './InputWrapper'

function TextAreaImpl(props: TextAreaProps) {
  return <RadixTextArea variant="soft" size="3" {...props} />
}

export const TextArea = withInputWrapper(TextAreaImpl)
