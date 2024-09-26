using System.ComponentModel.DataAnnotations;

namespace API.Models.DTOs;

public class RegisterDto
{
    [Required]
    [MaxLength(500)]
    public string? Username { get; set; }
    [Required]
    [StringLength(32, MinimumLength = 4)]
    public string? Password { get; set; }
    
    [Required] public string? KnownAs { get; set; }
    [Required] public string? Gender { get; set; }
    [Required] public string? DateOfBirth { get; set; }
    [Required] public string? City { get; set; }
    [Required] public string? Country { get; set; }
}