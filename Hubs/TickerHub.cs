using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using System; 

namespace Hubs;

public class TickerHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        // TODO: send a greeting/info message to the caller
        await Clients.Caller.SendAsync("Subscribed", "Connected successfully. Please subscribe to a symbol."); //
        await base.OnConnectedAsync();
    }

    // TODO: Implement Subscribe(symbol) -> add connection to a SignalR group and ack to caller
    public async Task Subscribe(string symbol) //
    {
        if (string.IsNullOrEmpty(symbol)) return;
        
        await Groups.AddToGroupAsync(Context.ConnectionId, symbol);
        
        await Clients.Caller.SendAsync("Subscribed", $"Subscribed to {symbol}");
    }

    // TODO: Implement SetMode(mode) -> broadcast to all clients
    public async Task SetMode(string mode) //
    {
        await Clients.All.SendAsync("ModeChanged", mode);
    }

    public async Task Ping(long clientTime) //
    {
        await Clients.Caller.SendAsync("Pong", clientTime);
    }
}