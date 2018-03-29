using System.Net;
using BaseballTheaterCore.Models;
using Common;
using Microsoft.AspNetCore.Mvc;

namespace BaseballTheaterCore.Controllers
{
    [Route("api/[controller]")]
    public class ProxyController : Controller
    {
        [HttpGet("[action]")]
        public ProxyModel Get(string mlbUrl, bool isJson = false)
        {
            var url = WebUtility.UrlDecode(mlbUrl);
            var loader = new DataLoader();
            var data = loader.GetString(url);

            var model = new ProxyModel(data, isJson);

            return model;
        }
    }
}
