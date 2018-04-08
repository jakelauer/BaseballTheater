using BaseballTheaterCore.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace BaseballTheaterCore.Controllers
{
    [Route("[controller]")]
    [Route("api/[controller]")]
    [Produces("application/xml")]
    public class DataController : BtController
    {
        [HttpGet("[action]")]
        public NewsModel News(string feeds = "", string favTeam = "")
        {
            var feedList = feeds.Split(',');

            var model = NewsModel.NewInstance(feedList, favTeam);
            model.PopulateModel();

            return model;
        }
    }
}