using backend.DTOs;
using backend.Validators;

namespace backend.Tests;

public class ValidatorTests
{
    [Fact]
    public void AddToCartRequest_ProductIdAtZero_ReturnsExpectedValidationError()
    {
        var validator = new AddToCartRequestValidator();
        var request = new AddToCartRequest { ProductId = 0, Quantity = 1 };

        var result = validator.Validate(request);

        var error = Assert.Single(result.Errors, e => e.PropertyName == nameof(AddToCartRequest.ProductId));
        Assert.Equal("ProductId must be greater than 0.", error.ErrorMessage);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(100)]
    public void AddToCartRequest_QuantityOutsideRange_ReturnsExpectedValidationError(int quantity)
    {
        var validator = new AddToCartRequestValidator();
        var request = new AddToCartRequest { ProductId = 1, Quantity = quantity };

        var result = validator.Validate(request);

        var error = Assert.Single(result.Errors, e => e.PropertyName == nameof(AddToCartRequest.Quantity));
        Assert.Equal("Quantity must be between 1 and 99.", error.ErrorMessage);
    }

    [Fact]
    public void UpdateCartItemRequest_ValidQuantity_HasNoValidationErrors()
    {
        var validator = new UpdateCartItemRequestValidator();
        var request = new UpdateCartItemRequest { Quantity = 50 };

        var result = validator.Validate(request);

        Assert.Empty(result.Errors);
    }
}
