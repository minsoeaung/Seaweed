using System.ComponentModel.DataAnnotations;

namespace API.DTOs.Requests;

public class RegisterDto
{
    [Required] public string UserName { get; set; }
    [Required] public string Password { get; set; }
    [Required] public string Email { get; set; }
}