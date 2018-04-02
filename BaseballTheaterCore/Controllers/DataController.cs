using BaseballTheaterCore.Models;
using Microsoft.AspNetCore.Mvc;

namespace BaseballTheaterCore.Controllers
{
    [Route("[controller]")]
    [Route("api/[controller]")]
    public class DataController : Controller
    {
        [HttpGet("[action]")]
        public NewsModel News(string feeds = "", string favTeam = "")
        {
            var feedList = feeds.Split(',');

            var model = new NewsModel(feedList, favTeam);
            model.PopulateModel();

            return model;
        }
    }
}