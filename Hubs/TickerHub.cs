using Microsoft.AspNetCore.SignalR;

namespace Hubs;

public class TickerHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        // TODO: send a greeting/info message to the caller
        await base.OnConnectedAsync();
    }

    // TODO: Implement Subscribe(symbol) -> add connection to a SignalR group and ack to caller

    // TODO: Implement SetMode(mode) -> broadcast to all clients

    // (Part D) OPTIONAL: Implement Ping/Pong for latency measurement
}