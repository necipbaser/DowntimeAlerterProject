using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using DowntimeAlerter.Core;
using DowntimeAlerter.Core.Services;
using DowntimeAlerter.Data;
using DowntimeAlerter.MVC.ActionFilters;
using DowntimeAlerter.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace DowntimeAlerter.MVC
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
            services.AddControllersWithViews();

            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddDbContext<DowntimeAlerterDbContext>(options => options.UseSqlServer(Configuration.GetConnectionString("DevConnection"), x => x.MigrationsAssembly("DowntimeAlerter.Data")));

            services.AddTransient<ISiteEmailService, SiteEmailService>();
            services.AddTransient<ISiteService, SiteService>();
            services.AddTransient<IUserService, UserService>();
            services.AddTransient<ILogService, LogService>();
            services.AddAutoMapper(typeof(Startup));

            services.AddControllersWithViews().AddRazorRuntimeCompilation();

            services.AddScoped<LoginFilterAttribute>();
            services.AddSingleton<IHttpContextAccessor,
                HttpContextAccessor>();

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }
            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}