import { attach, createEvent, sample } from 'effector'
import { uniqBy } from 'lodash-es'

import {
  type NewCounter,
} from '@/entities/counter'
import { createCounterFx } from '@/entities/counter'

import { navigateTo } from '@/shared/routing'

export const formSubmitted = createEvent<NewCounter>()

const formSubmittedMapped = sample({
  clock: formSubmitted,
  fn: (data) => ({
    ...data,
    steps: uniqBy(data.steps, (step) => step.value),
  }),
})

const createCounterByEditorFx = attach({ effect: createCounterFx })

sample({
  clock: formSubmittedMapped,
  target: createCounterByEditorFx,
})

sample({
  clock: [ createCounterByEditorFx.doneData ],
  fn: ({ id }) => ({ to: `/counter/${id}` }),
  target: navigateTo,
})
