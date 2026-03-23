using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/cart")]
public class CartController : ControllerBase
{
    private const string CurrentUserId = "default-user";

    private readonly MarketplaceContext _context;

    public CartController(MarketplaceContext context)
    {
        _context = context;
    }

    // GET /api/cart
    [HttpGet]
    public async Task<ActionResult<CartResponse>> GetCart()
    {
        var cart = await _context.Carts
            .Include(c => c.Items)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(c => c.UserId == CurrentUserId);

        if (cart is null)
            return NotFound();

        return Ok(MapToCartResponse(cart));
    }

    // POST /api/cart
    [HttpPost]
    public async Task<ActionResult<CartItemResponse>> AddToCart(AddToCartRequest request)
    {
        var product = await _context.Products.FindAsync(request.ProductId);
        if (product is null)
            return NotFound($"Product {request.ProductId} not found.");

        var cart = await _context.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.UserId == CurrentUserId);

        if (cart is null)
        {
            cart = new Cart { UserId = CurrentUserId };
            _context.Carts.Add(cart);
        }

        var existingItem = cart.Items.FirstOrDefault(i => i.ProductId == request.ProductId);

        if (existingItem is not null)
        {
            existingItem.Quantity += request.Quantity;
        }
        else
        {
            existingItem = new CartItem
            {
                ProductId = request.ProductId,
                Quantity = request.Quantity
            };
            cart.Items.Add(existingItem);
        }

        cart.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        // Reload product for mapping
        await _context.Entry(existingItem).Reference(i => i.Product).LoadAsync();

        return CreatedAtAction(nameof(GetCart), MapToCartItemResponse(existingItem));
    }

    // PUT /api/cart/{cartItemId}
    [HttpPut("{cartItemId}")]
    public async Task<ActionResult<CartItemResponse>> UpdateCartItem(int cartItemId, UpdateCartItemRequest request)
    {
        var cartItem = await _context.CartItems
            .Include(i => i.Cart)
            .Include(i => i.Product)
            .FirstOrDefaultAsync(i => i.Id == cartItemId);

        if (cartItem is null)
            return NotFound($"Cart item {cartItemId} not found.");

        if (cartItem.Cart.UserId != CurrentUserId)
            return Forbid();

        cartItem.Quantity = request.Quantity;
        cartItem.Cart.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(MapToCartItemResponse(cartItem));
    }

    // DELETE /api/cart/{cartItemId}
    [HttpDelete("{cartItemId}")]
    public async Task<IActionResult> RemoveCartItem(int cartItemId)
    {
        var cartItem = await _context.CartItems
            .Include(i => i.Cart)
            .FirstOrDefaultAsync(i => i.Id == cartItemId);

        if (cartItem is null)
            return NotFound($"Cart item {cartItemId} not found.");

        if (cartItem.Cart.UserId != CurrentUserId)
            return Forbid();

        _context.CartItems.Remove(cartItem);
        cartItem.Cart.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE /api/cart/clear
    [HttpDelete("clear")]
    public async Task<IActionResult> ClearCart()
    {
        var cart = await _context.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.UserId == CurrentUserId);

        if (cart is null)
            return NotFound();

        _context.CartItems.RemoveRange(cart.Items);
        cart.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // --- Mapping helpers ---

    private static CartResponse MapToCartResponse(Cart cart) => new()
    {
        Id = cart.Id,
        UserId = cart.UserId,
        CreatedAt = cart.CreatedAt,
        UpdatedAt = cart.UpdatedAt,
        Items = cart.Items.Select(MapToCartItemResponse).ToList()
    };

    private static CartItemResponse MapToCartItemResponse(CartItem item) => new()
    {
        Id = item.Id,
        ProductId = item.ProductId,
        ProductName = item.Product.Name,
        Price = item.Product.Price,
        ImageUrl = item.Product.ImageUrl,
        Quantity = item.Quantity
    };
}
