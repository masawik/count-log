type FetchParams = Parameters<typeof fetch>

export class ApiClientError extends Error {
  response: Response

  constructor(response: Response) {
    super(response.statusText)
    this.response = response
  }
}

export const isApiClientError = (e: unknown) => e instanceof ApiClientError

export const api = async (input: FetchParams[0], init?: FetchParams[1]) => {
  const res = await fetch(input, init)

  if (!res.ok) {
    throw new ApiClientError(res)
  }

  return res
}
