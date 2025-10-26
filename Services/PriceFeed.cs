using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using System.Timers;
using Hubs;
using System; 
using System.Threading.Tasks; 

namespace Services;

public class PriceFeed : IHostedService, IDisposable
{
    private readonly IHubContext<TickerHub> _hub;
    private readonly System.Timers.Timer _timer;
    private readonly ConcurrentDictionary<string, decimal> _prices = new();
    private readonly Random _random = new(); 

    // Vietnamese stock symbols to use:
    // VNM, FPT, HPG, VCB, SSI, VHM, VIC, BID, CTG, GAS
    private readonly string[] _symbols = { "VNM", "FPT", "HPG", "VCB", "SSI", "VHM", "VIC", "BID", "CTG", "GAS" }; 

    public PriceFeed(IHubContext<TickerHub> hub)
    {
        _hub = hub;
        _timer = new System.Timers.Timer(500); // TODO: allow changing interval for experiments
        _timer.Elapsed += OnTick;

        foreach (var symbol in _symbols)
        {
            _prices.TryAdd(symbol, 40000 + (decimal)(_random.NextDouble() * 20000));
        }
    }

    private async void OnTick(object? sender, ElapsedEventArgs e) 
    {
        foreach (var symbol in _symbols)
        {
            var newPrice = _prices.AddOrUpdate(symbol,
                0, 
                (key, oldPrice) => 
                {
                    var fluctuation = (decimal)(_random.NextDouble() * 1000 - 500); // Tăng/giảm ngẫu nhiên
                    var price = oldPrice + fluctuation;
                    if (price < 10000) price = 10000; 
                    return price;
                }
            );


            await _hub.Clients.Group(symbol).SendAsync("PriceUpdate", new 
            {
                symbol = symbol,
                price = newPrice,
                serverTime = e.SignalTime 
            });
        }
    }

    public Task StartAsync(CancellationToken ct) { _timer.Start(); return Task.CompletedTask; }
    public Task StopAsync(CancellationToken ct) { _timer.Stop(); return Task.CompletedTask; }
    public void Dispose() { _timer.Dispose(); }
}