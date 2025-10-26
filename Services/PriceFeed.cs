using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using System.Timers;
using Hubs;

namespace Services;

public class PriceFeed : IHostedService, IDisposable
{
    private readonly IHubContext<TickerHub> _hub;
    private readonly System.Timers.Timer _timer;
    private readonly ConcurrentDictionary<string, decimal> _prices = new();

    // Vietnamese stock symbols to use:
    // VNM, FPT, HPG, VCB, SSI, VHM, VIC, BID, CTG, GAS

    public PriceFeed(IHubContext<TickerHub> hub)
    {
        _hub = hub;
        _timer = new System.Timers.Timer(500); // TODO: allow changing interval for experiments
        _timer.Elapsed += OnTick;
    }

    private void OnTick(object? sender, ElapsedEventArgs e)
    {
        // TODO: update prices for each symbol and send to the corresponding SignalR group
        // Example message:
        // await _hub.Clients.Group(symbol).SendAsync("PriceUpdate", new { symbol, price, serverTime = DateTime.UtcNow });
    }

    public Task StartAsync(CancellationToken ct) { _timer.Start(); return Task.CompletedTask; }
    public Task StopAsync(CancellationToken ct) { _timer.Stop(); return Task.CompletedTask; }
    public void Dispose() { _timer.Dispose(); }
}