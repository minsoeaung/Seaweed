using System.ComponentModel.DataAnnotations;

namespace API.Entities;

public class Brand
{
    public int Id { get; set; }
    // TODO: no comma allowed
    [Required] public string Name { get; set; }
}