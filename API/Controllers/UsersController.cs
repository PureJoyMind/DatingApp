using API.Interfaces;
using API.Models;
using API.Models.DTOs;
using API.Services.Extensions;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class UsersController(IUserRepository userRepository, 
    IMapper mapper, IPhotoService photoService) : ApiBaseController
{
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
    {
        var users = await userRepository.GetMembersAsync();
        
        return Ok(users);
    }

    [HttpGet("{username}")]
    public async Task<ActionResult<MemberDto>> GetUser(string username)
    {
        var user = await userRepository.GetMemberAsync(username);
        if (user == null) return NotFound();
        
        return Ok(user);
    }

    [HttpPut]
    public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());

        if (user is null) return BadRequest("User not found");

        mapper.Map(memberUpdateDto, user);
        if (await userRepository.SaveAllAsync()) return NoContent();

        return BadRequest("Failed to update user");
    }

    [HttpPost("add-photo")]
    public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());

        if (user is null) return BadRequest("User not found");

        var result = await photoService.AddPhotoAsync(file);

        if (result.Error != null) BadRequest(result.Error.Message);

        var photo = new Photo()
        {
            Url = result.SecureUrl.AbsoluteUri,
            PublicId = result.PublicId
        };
        
        user.Photos.Add(photo);

        if (await userRepository.SaveAllAsync()) 
            return CreatedAtAction(nameof(GetUser), new {username = user.UserName}, mapper.Map<PhotoDto>(photo));

        return BadRequest("Problem adding photo");
    }

    [HttpPut("set-main-photo/{photoId}")]
    public async Task<ActionResult> SetMainPhoto(int photoId)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());

        if (user is null) return BadRequest("User not found");

        var photo = user.Photos.FirstOrDefault(p => p.Id == photoId && !p.IsMain);

        if (photo is null) return BadRequest("Cannot user this as main photo");

        var currentMain = user.Photos.FirstOrDefault(x => x.IsMain);
        if (currentMain is not null) currentMain.IsMain = false;

        photo.IsMain = true;
        
        if (await userRepository.SaveAllAsync()) return NoContent();

        return BadRequest("Problem setting the main photo.");
    }

    [HttpDelete("delete-photo/{photoId:int}")]
    public async Task<ActionResult> DeletePhoto(int photoId)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());

        if (user is null) return BadRequest("User not found");
        var photo = user.Photos.FirstOrDefault(p => p.Id == photoId);
        if(photo is null || photo.IsMain) return BadRequest("Unable to delete photo");

        if (!string.IsNullOrEmpty(photo.PublicId))
        {
            var res = await photoService.DeletePhotoAsync(photo.PublicId);
            if (res.Error is not null) return BadRequest(res.Error.Message);
        }

        user.Photos.Remove(photo);
        
        if (await userRepository.SaveAllAsync()) return Ok();
        return BadRequest("Failed to delete photo");
    }
} 