export default defineNuxtRouteMiddleware(async () => {
  const { $client } = useNuxtApp()

  const { data } = await $client.me.get.useQuery()
  console.log(data.value)
  if (data.value?.id)
    return '/dashboard'
})
