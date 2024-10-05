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
        CreateMap<MemberUpdateDto, AppUser>();
        
        CreateMap<RegisterDto, AppUser>();
            // .ForMember(d => d.DateOfBirth, o => 
            //     o.MapFrom(b => DateOnly.Parse(b.DateOfBirth!)));
        CreateMap<string, DateOnly>().ConvertUsing(s => DateOnly.Parse(s));
        
        CreateMap<Message, MessageDto>()
            .ForMember(d => d.SenderPhotoUrl, 
                o => o.MapFrom(s => s.Sender.Photos.FirstOrDefault(x => x.IsMain)!.Url))
            .ForMember(d => d.RecipientPhotoUrl, 
                o => o.MapFrom(s => s.Recipient.Photos.FirstOrDefault(x => x.IsMain)!.Url));
    }
}