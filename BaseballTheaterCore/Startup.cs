using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MlbDataEngine.Engine;
using Newtonsoft.Json.Linq;

namespace BaseballTheaterCore
{
    public class Startup
    {
        private readonly IHostingEnvironment currentEnvironment;

        public Startup(IConfiguration configuration, IHostingEnvironment env)
        {
            currentEnvironment = env;
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services
                .Configure<GzipCompressionProviderOptions>(options =>
                    options.Level = System.IO.Compression.CompressionLevel.Optimal);

            services
                .AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
                .AddCookie(options =>
                {
                    options.LoginPath = "/Auth/Login";
                    options.LogoutPath = "/Auth/Signout";
                    options.ExpireTimeSpan = DateTime.UtcNow.AddYears(100) - DateTime.UtcNow;
                })
                .AddPatreon(options =>
                {
                    options.ClientId = Config.ClientId;
                    options.SaveTokens = true;
                    options.CallbackPath = "/Auth/Authorize";
                    options.ClientSecret = Config.ClientSecret;

                    options.Events = new OAuthEvents()
                    {
                        OnCreatingTicket = async context => { await this.MakeUserClaim(context); }
                    };
                });

            services
                .AddResponseCompression(options =>
                {
                    options.EnableForHttps = true;
                    options.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat(new[]
                    {
                        // Default
                        "text/plain",
                        "text/css",
                        "application/javascript",
                        "text/html",
                        "application/xml",
                        "text/xml",
                        "application/json",
                        "text/json",
                        // Custom
                        "image/svg+xml"
                    });
                })
                .AddMvc(options =>
                {
                    options.RequireHttpsPermanent = true; // this does not affect api requests
                    options.RespectBrowserAcceptHeader = true; // false by default
                    //options.OutputFormatters.RemoveType<HttpNoContentOutputFormatter>();

                    // these two are here to show you where to include custom formatters
                    options.OutputFormatters.Add(new XmlSerializerOutputFormatter());
                    options.OutputFormatters.Add(new XmlDataContractSerializerOutputFormatter());
                    options.InputFormatters.Add(new XmlSerializerInputFormatter());
                    options.InputFormatters.Add(new XmlDataContractSerializerInputFormatter());
                });

            if (!currentEnvironment.IsDevelopment())
            {
                services.Configure<MvcOptions>(options => { options.Filters.Add(new RequireHttpsAttribute()); });
            }
        }

        private async Task MakeUserClaim(OAuthCreatingTicketContext context)
        {
            var endpoint = "https://www.patreon.com/api/oauth2/api/current_user?include=relationships,reward"; //context.Options.UserInformationEndpoint override
            var request = new HttpRequestMessage(HttpMethod.Get, endpoint);
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", context.AccessToken);
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var response = await context.Backchannel.SendAsync(request, context.HttpContext.RequestAborted);
            response.EnsureSuccessStatusCode();

            // Extract the user info object
            var userResponse = JObject.Parse(await response.Content.ReadAsStringAsync());

            // Add the Name Identifier claim
            if (userResponse.GetValue("data") is JObject data)
            {
                var id = data.Value<string>("id");

                context.Identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, id, ClaimValueTypes.String, context.Options.ClaimsIssuer));

                if (data.GetValue("attributes") is JObject attributes)
                {
                    var email = attributes.Value<string>("email");
                    context.Identity.AddClaim(new Claim(ClaimsIdentity.DefaultNameClaimType, email, ClaimValueTypes.String, context.Options.ClaimsIssuer));
                }

                if (userResponse.GetValue("included") is JArray included)
                {
                    if (included.First is JObject firstIncluded
                        && firstIncluded.GetValue("relationships") is JObject relationships
                        && relationships.GetValue("reward") is JObject reward
                        && reward.GetValue("data") is JObject rewardData)
                    {
                        var rewardId = rewardData.Value<int>("id");
                        context.Identity.AddClaim(new Claim("RewardId", rewardId.ToString()));
                    }
                }
            }
        }


        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
                {
                    HotModuleReplacement = true,
                    ReactHotModuleReplacement = true,
                });
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");

                var options = new RewriteOptions()
                    .AddRedirectToHttps();

                app.UseRewriter(options);
            }

            app.UseStaticFiles();
            app.UseAuthentication();
            app.UseResponseCompression();
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");

                routes.MapSpaFallbackRoute(
                    name: "spa-fallback",
                    defaults: new {controller = "Home", action = "Index"});
            });
        }
    }
}