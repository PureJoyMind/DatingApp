using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models;

/*
 * We don't have to create a DbSet for this type,
 * since AppUser has a navigation property for this
 * we can use that to query the photos and ef core will
 * understand enough to create a table for this.
 * Since we don't need to query photos by their direct ids
 * this functionality is enough for us.
 */
[Table("Photos")]
public class Photo
{
    public int Id { get; set; }
    public string Url { get; set; }
    public bool IsMain { get; set; }
    public string? PublicId { get; set; }
    
    // Navigational Props
    public int AppUserId { get; set; }
    public AppUser AppUser { get; set; } = null!;

}