using System.ComponentModel.DataAnnotations;

namespace API.Entities;

public class Country
{
    public int Id { get; set; }
    [Required] [MaxLength(100)] public string Name { get; set; }
    [Required] [MaxLength(2)] public string Alpha2Code { get; set; }
}