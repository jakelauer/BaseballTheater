using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using BaseballTheaterCore.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;

namespace BaseballTheaterCore.Controllers
{
    public class HomeController : BtController
    {
        public IActionResult Index()
        {
            var view = "Index";

            if (Request.Host.Host.Contains("beta") && !User.Identity.IsAuthenticated)
            {
                view = "Login";
            }
            
            var model = new HomeModel();
            model.OnGet();
            return View(view, model);
        }

        public IActionResult Error()
        {
            ViewData["RequestId"] = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
            return View();
        }
    }
}