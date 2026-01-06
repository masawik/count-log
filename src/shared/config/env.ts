export const IS_DEV = import.meta.env.DEV
export const IS_TEST = import.meta.env.MODE === 'test' || import.meta.env.VITE_E2E === '1'
