﻿using TUnit.Core.Interfaces;

namespace Sage.Tests.Data
{
    public class HttpClientDataClass : IAsyncInitializer, IAsyncDisposable
    {
        public HttpClient HttpClient { get; private set; } = new();

        public async Task InitializeAsync()
        {
            HttpClient = (GlobalHooks.App ?? throw new NullReferenceException()).CreateHttpClient("api", "http");
            if (GlobalHooks.NotificationService != null)
            {
                await GlobalHooks.NotificationService.WaitForResourceAsync("api", KnownResourceStates.Running)
                    .WaitAsync(TimeSpan.FromSeconds(30));
            }
        }

        public async ValueTask DisposeAsync()
        {
            await Console.Out.WriteLineAsync("And when the class is finished with, we can clean up any resources.");
        }
    }
}
