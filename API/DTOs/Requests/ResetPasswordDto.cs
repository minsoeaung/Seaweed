using System.ComponentModel.DataAnnotations;

namespace API.DTOs.Requests;

public class ResetPasswordDto
{
    [Required]
    [MinLength(6, ErrorMessage = "The field Password must have a minimum length of 6.")]
    public string NewPassword { get; set; }

    [Required] [EmailAddress] public string Email { get; set; }

    [Required] public string Token { get; set; }
}