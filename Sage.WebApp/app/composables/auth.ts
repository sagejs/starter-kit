import {useQuery, useMutation} from '@tanstack/vue-query'

export function useAuthWhoAmI() {
    const {$apiClient} = useNuxtApp()
    return useQuery({
        queryKey: ['auth', 'whoAmI'],
        queryFn: () => $apiClient.auth.whoAmI.get()
    })
}

export function useAuthVerifyMutation() {
    const {$apiClient} = useNuxtApp()
    return useMutation({
        mutationFn: $apiClient.auth.verify.post
    })
}

export function useAuthLoginMutation() {
    const {$apiClient} = useNuxtApp()
    return useMutation({
        mutationFn: $apiClient.auth.login.post
    })
}