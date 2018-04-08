using System.Security.Claims;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace BaseballTheaterCore.Models
{
    public class HomeModel : PageModel
    {
        public string Name { get; set; }
        
        public void OnGet()
        {
        }
    }
}