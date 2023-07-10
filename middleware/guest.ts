import { createSessionContext } from '../server/utils/session'

export default defineNuxtRouteMiddleware(async () => {
  if (process.client) {
    const { $client } = useNuxtApp()

    const { data } = await $client.me.get.useQuery()
    if (data.value.id)
      return '/dashboard'
  }
  else {
    const event = useRequestEvent()
    const session = createSessionContext(event)

    if ((await session.get()).data.id)
      return '/dashboard'
  }
})
