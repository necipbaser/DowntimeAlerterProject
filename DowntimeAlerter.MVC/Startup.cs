using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using DowntimeAlerter.Core;
using DowntimeAlerter.Core.Services;
using DowntimeAlerter.Core.Utilities;
using DowntimeAlerter.Data;
using DowntimeAlerter.MVC.ActionFilters;
using DowntimeAlerter.Services;
using Hangfire;
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
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllersWithViews();

            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddDbContext<DowntimeAlerterDbContext>(options => options.UseSqlServer(Configuration.GetConnectionString("DevConnection"), x => x.MigrationsAssembly("DowntimeAlerter.Data")));

            services.AddTransient<ISiteEmailService, SiteEmailService>();
            services.AddTransient<ISiteService, SiteService>();
            services.AddTransient<IUserService, UserService>();
            services.AddTransient<ILogService, LogService>();
            services.AddTransient<INotificationLogService, NotificationLogService>();
            services.AddAutoMapper(typeof(Startup));

            services.AddControllersWithViews().AddRazorRuntimeCompilation();

            services.AddScoped<LoginFilterAttribute>();
            services.AddSingleton<IHttpContextAccessor,
                HttpContextAccessor>();

            services.AddHangfire(x =>x.UseSqlServerStorage("Server=(localdb)\\MSSQLLocalDB;Database=DowntimeAlerter;Trusted_Connection=True;MultipleActiveResultSets=true"));
            services.Configure<MailSettings>(Configuration.GetSection("MailSettings"));

        }
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
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

            using (var serviceScope = app.ApplicationServices.GetService<IServiceScopeFactory>().CreateScope())
            {
                var context = serviceScope.ServiceProvider.GetRequiredService<DowntimeAlerterDbContext>();
                context.Database.Migrate();
                context.Database.EnsureCreated();
                app.UseHangfireDashboard();
                app.UseHangfireServer();
            }
        }
    }
}