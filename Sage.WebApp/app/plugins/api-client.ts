import { AnonymousAuthenticationProvider } from "@microsoft/kiota-abstractions";
import { FetchRequestAdapter, KiotaClientFactory } from "@microsoft/kiota-http-fetchlibrary";
import { createApiClient } from "~/api/apiClient";

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()

    const authProvider = new AnonymousAuthenticationProvider();
    const httpClient = KiotaClientFactory.create((request, init) => fetch(request, { credentials: 'include', ...init }));
    const adapter = new FetchRequestAdapter(authProvider, undefined, undefined, httpClient);
    adapter.baseUrl = config.public.api

    return {
        provide: {
            apiClient: createApiClient(adapter)
        }
    }
})
