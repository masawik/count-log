import { TextField as RadixTextField } from '@radix-ui/themes'

import { withInputWrapper } from './InputWrapper'


function TextField({ ...props }: RadixTextField.RootProps) {
  return <RadixTextField.Root variant="soft" size="3" {...props} />
}

export default {
  ...RadixTextField,
  Root: withInputWrapper(TextField),
}
