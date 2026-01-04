import {
  TextArea as RadixTextArea,
  type TextAreaProps,
} from '@radix-ui/themes'

export function TextArea(props: TextAreaProps) {
  return <RadixTextArea variant="soft" size="3" {...props} />
}
