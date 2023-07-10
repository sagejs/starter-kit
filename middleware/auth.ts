import { createSessionContext } from '../server/utils/session'

export default defineNuxtRouteMiddleware(async () => {
  if (process.client) {
    const { $client } = useNuxtApp()

    const { error } = await $client.me.get.useQuery()
    if (error.value?.data?.code === 'UNAUTHORIZED')
      return '/login'
  }
  else {
    const event = useRequestEvent()
    const session = createSessionContext(event)

    if (!(await session.get()).data.id)
      return '/login'
  }
})
