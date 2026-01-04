import { TextField as RadixTextField } from '@radix-ui/themes'

import { withLabel } from '../component-helpers'

function TextField({ name, ...props }: RadixTextField.RootProps) {
  return <RadixTextField.Root variant="soft" size="3" name={name} {...props} />
}

export default {
  ...RadixTextField,
  Root: withLabel(TextField),
}
