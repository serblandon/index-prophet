using Microsoft.EntityFrameworkCore;
using Serilog;
using System.Reflection;
using WebApi.Data;
using WebApi.Helpers;
using WebApi.Logic.LiveApi;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddHttpClient<LiveApiService>();
builder.Services.AddSingleton<LiveApiService>();
builder.Services.AddMemoryCache();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register MediatR
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));
builder.Services.AddScoped<TechnicalIndicatorsHelper>();

builder.Services.AddDbContext<IndexProphetContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .MinimumLevel.Warning()
    .WriteTo.Console()
    .WriteTo.File("Logs/app-log-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(policy =>
    policy.WithOrigins("http://localhost:4200", "https://localhost:44361/")
           .AllowAnyMethod()
           .AllowAnyHeader()
           );

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
