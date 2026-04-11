using System.Net;
using Microsoft.AspNetCore.Mvc.Testing;

namespace backend.Tests;

public class CartAuthorizationIntegrationTests
{
    [Fact]
    public async Task GetCart_WithoutJwtToken_ReturnsUnauthorized()
    {
        Environment.SetEnvironmentVariable("JWT_KEY", "this-is-a-minimum-32-character-test-key");

        using var factory = new WebApplicationFactory<Program>();
        using var client = factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            BaseAddress = new Uri("https://localhost")
        });

        var response = await client.GetAsync("/api/cart");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }
}
