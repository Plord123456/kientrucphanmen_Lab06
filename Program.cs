using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

// TODO: Add SignalR service
// builder.Services.AddSignalR();

// TODO: Register hosted service for price feed
// builder.Services.AddHostedService<Services.PriceFeed>();

builder.Services.AddResponseCompression(options =>
{
    options.MimeTypes = new[] { "application/octet-stream" };
});

var app = builder.Build();
app.UseResponseCompression();
app.UseStaticFiles();

// TODO: Map hub endpoint, e.g. app.MapHub<Hubs.TickerHub>("/hubs/ticker");

app.Run();