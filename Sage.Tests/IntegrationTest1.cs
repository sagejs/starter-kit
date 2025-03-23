using Sage.Tests.Data;

namespace Sage.Tests
{
    public class IntegrationTest1
    {
        [ClassDataSource<HttpClientDataClass>]
        [Test]
        public async Task GetApiHealthReturnsOkStatus(HttpClientDataClass httpClientData)
        {
            // Arrange
            var httpClient = httpClientData.HttpClient;
            // Act
            var response = await httpClient.GetAsync("/health");
            // Assert
            await Assert.That(response.StatusCode).IsEqualTo(HttpStatusCode.OK);
        }
        
        [ClassDataSource<HttpClientDataClass>]
        [Test]
        public async Task GetApiAliveReturnsOkStatus(HttpClientDataClass httpClientData)
        {
            // Arrange
            var httpClient = httpClientData.HttpClient;
            // Act
            var response = await httpClient.GetAsync("/alive");
            // Assert
            await Assert.That(response.StatusCode).IsEqualTo(HttpStatusCode.OK);
        }
    }
}