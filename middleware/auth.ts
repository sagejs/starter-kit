import { createSessionContext } from '../server/utils/session'

export default defineNuxtRouteMiddleware(async () => {
  if (process.client)
    return

  const event = useRequestEvent()
  const session = createSessionContext(event)

  if (!(await session.get()).data.id)
    return '/login'
})
