using API.Data;
using API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController(DataContext context) : ControllerBase
{
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers()
    {
        var users = await context.Users.ToListAsync();
        if (users.Count == 0) return NotFound();
        return Ok(users);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<AppUser>> GetUser(int id)
    {
        var user = await context.Users.FindAsync(id);

        if (user == null) return NotFound();
        
        return Ok(user);
    }

    [HttpPost("add")]
    public async Task<ActionResult> AddUser([FromBody] AppUser user)
    {
        await context.Users.AddAsync(user);
        await context.SaveChangesAsync();
        return Ok("user created");
    }
}