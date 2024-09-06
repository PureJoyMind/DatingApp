using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.Interfaces;
using API.Models;
using API.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController(DataContext context, ITokenService tokenService) : ApiBaseController
{
    [HttpPost("register")] // api/account/register
    public async Task<ActionResult<UserDto>> Register(RegisterDto request)
    {
        if (await UserExists(request.Username)) return BadRequest("User already exists");
        
        using var hmac = new HMACSHA512();
        var salt = hmac.Key;
        var ecnryptedPass = hmac.ComputeHash(Encoding.UTF8.GetBytes(request.Password));
        var user = new AppUser
        {
            UserName = request.Username.ToLower(),
            PasswordHash = ecnryptedPass,
            PasswordSalt = salt
        };

        var created = await context.Users.AddAsync(user);
        
        await context.SaveChangesAsync();
        return new UserDto{Username = user.UserName, Token = tokenService.CreateToken(user)};
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto request)
    {
        var user = await context.Users.FirstOrDefaultAsync(u => u.UserName == request.Username.ToLower());
        if (user == null) return Unauthorized("Invalid Username");

        using var hmac = new HMACSHA512(user.PasswordSalt);
        var encryptedPass = hmac.ComputeHash(Encoding.UTF8.GetBytes(request.Password));

        for (int i = 0; i < encryptedPass.Length; i++)
        {
            if (encryptedPass[i] != user.PasswordHash[i]) return Unauthorized("Invalid Password");
        }

        return new UserDto{Username = user.UserName, Token = tokenService.CreateToken(user)};
    }
    
    private async Task<bool> UserExists(string username) =>
        await context.Users.AnyAsync(u => u.UserName.ToLower() == username.ToLower());
}