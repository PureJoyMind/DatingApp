using System.ComponentModel.DataAnnotations;

namespace API.Models.DTOs;

public class RegisterDto
{
    [MaxLength(100)]
    public required string Username { get; set; }
    public required string Password { get; set; }
}