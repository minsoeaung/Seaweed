using System.ComponentModel.DataAnnotations;

namespace API.DTOs.Requests;

public class RegisterDto
{
    [Required]
    [StringLength(50, MinimumLength = 4,
        ErrorMessage = "The field Username must have a minimum length of 4 and a maximum length of 50.")]
    public string UserName { get; set; }

    [Required]
    [MinLength(6, ErrorMessage = "The field Password must have a minimum length of 6.")]
    public string Password { get; set; }

    [Required] [EmailAddress] public string Email { get; set; }
}