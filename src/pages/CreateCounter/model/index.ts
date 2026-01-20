import { attach, createEvent, sample } from 'effector'

import {
  type NewCounter,
} from '@/entities/counter'
import { createCounterFx } from '@/entities/counter'

import { navigateTo } from '@/shared/routing'

export const formSubmitted = createEvent<NewCounter>()

const createCounterByEditorFx = attach({ effect: createCounterFx })

sample({
  clock: formSubmitted,
  target: createCounterByEditorFx,
})

sample({
  clock: [ createCounterByEditorFx.doneData ],
  fn: ({ id }) => ({ to: `/counter/${id}` }),
  target: navigateTo,
})
