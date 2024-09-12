using API.Interfaces;
using API.Models;
using API.Models.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Repositories;

public class UserRepository(DataContext context, IMapper mapper) : IUserRepository
{
    public void Update(AppUser user)
    {
        context.Entry(user).State = EntityState.Modified;
    }

    public async Task<bool> SaveAllAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }

    public async Task<IEnumerable<AppUser>> GetUsersAsync()
    {
        return await context.Users
            .Include(u => u.Photos)
            .ToListAsync();
    }

    public async Task<AppUser?> GetUserByIdAsync(int id)
    {
        return await context.Users.FindAsync(id);
    }

    public async Task<AppUser?> GetUserByUsernameAsync(string username)
    {
        return await context.Users
            .Include(u => u.Photos)
            .SingleOrDefaultAsync(u => u.UserName == username.ToLower());

    }

    public async Task<IEnumerable<MemberDto>> GetMembersAsync()
    {
        return await context.Users
            .ProjectTo<MemberDto>(mapper.ConfigurationProvider)
            .ToListAsync();
    }

    public async Task<MemberDto?> GetMemberAsync(string username)
    {
        return await context.Users
            .Where(x => x.UserName == username.ToLower())
            .ProjectTo<MemberDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync();
    }
}