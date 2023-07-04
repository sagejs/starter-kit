import type { inferAsyncReturnType } from '@trpc/server'
import type { H3Event, SessionData } from 'h3'

type SessionUpdate<T extends SessionData = SessionData> = Partial<SessionData<T>> | ((oldData: SessionData<T>) => Partial<SessionData<T>> | undefined)

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export function createContext(_event: H3Event) {
  const config = {
    password: useRuntimeConfig().sessionSecret,
  }

  return {
    prisma,
    session: {
      get<T extends SessionData>() {
        return getSession<T>(_event, config)
      },
      update<T extends SessionData>(update: SessionUpdate<T>) {
        return updateSession<T>(_event, config, update)
      },
      seal<T extends SessionData>() {
        return sealSession<T>(_event, config)
      },
      unseal(sealed: string) {
        return unsealSession(_event, config, sealed)
      },
      clear() {
        return clearSession(_event, config)
      },
    },
  }
}

export type Context = inferAsyncReturnType<typeof createContext>
