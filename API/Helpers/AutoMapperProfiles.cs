using API.Models;
using API.Models.DTOs;
using API.Services.Extensions;
using AutoMapper;

namespace API.Helpers;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        // map from appuser to memberdto
        CreateMap<AppUser, MemberDto>()
            .ForMember(d => d.Age,
                o =>
                    o.MapFrom(u => u.DateOfBirth.CalculateAge()))
            .ForMember(d => d.PhotoUrl, 
                o => 
                    o.MapFrom(s => s.Photos.FirstOrDefault(x => x.IsMain)!.Url));
            
        CreateMap<Photo, PhotoDto>();
    }
}