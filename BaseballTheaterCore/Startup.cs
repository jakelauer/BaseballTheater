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
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.AspNetCore.ResponseCompression;
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
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services
                .Configure<GzipCompressionProviderOptions>(options =>
                    options.Level = System.IO.Compression.CompressionLevel.Optimal)
                .AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                    options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = "Patreon";
                })
                .AddCookie()
                .AddOAuth("Patreon", options =>
                {
                    options.ClientId = Configuration["Patreon:ClientId"];
                    options.ClientSecret = Configuration["Patreon:ClientSecret"];
                    options.CallbackPath = new PathString("/Auth");

                    options.AuthorizationEndpoint = "https://www.patreon.com/oauth2/authorize";
                    options.TokenEndpoint = "https://www.patreon.com/api/oauth2/token";
                    options.UserInformationEndpoint = "https://www.patreon.com/api/oauth2/api/current_user";
/*
                    options.ClaimActions.MapJsonKey(ClaimTypes.NameIdentifier, "id");
                    options.ClaimActions.MapJsonKey(ClaimTypes.Name, "name");
                    options.ClaimActions.MapJsonKey("urn:github:login", "login");
                    options.ClaimActions.MapJsonKey("urn:github:url", "html_url");
                    options.ClaimActions.MapJsonKey("urn:github:avatar", "avatar_url");*/

                    options.Events = new OAuthEvents
                    {
                        OnCreatingTicket = async context =>
                        {
                            var request = new HttpRequestMessage(HttpMethod.Get, context.Options.UserInformationEndpoint);
                            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", context.AccessToken);

                            var response = await context.Backchannel.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, context.HttpContext.RequestAborted);
                            response.EnsureSuccessStatusCode();

                            var user = JObject.Parse(await response.Content.ReadAsStringAsync());

                            context.RunClaimActions(user);
                        }
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