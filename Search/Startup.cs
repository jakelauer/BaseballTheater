using System.Linq;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MlbDataEngine.Engine;

namespace Search
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
				.Configure<GzipCompressionProviderOptions>(options => options.Level = System.IO.Compression.CompressionLevel.Optimal)
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
			
			services.AddCors(options =>
			{
				options.AddPolicy("AllowSpecificOrigin", builder => builder.WithOrigins(
					"http://baseball.theater",
					"https://baseball.theater",
					"http://beta.baseball.theater",
					"https://beta.baseball.theater",
					"http://jlauer.local")
				);
			});
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IHostingEnvironment env)
		{
			if (env.IsDevelopment())
			{
				app.UseDeveloperExceptionPage();
			}
			else
			{
				app.UseExceptionHandler("/Home/Error");
			}

			app.UseCors("AllowSpecificOrigin");
			app.UseStaticFiles();
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

			HighlightDatabase.Initialize();
		}
	}
}