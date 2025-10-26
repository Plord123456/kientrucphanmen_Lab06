// TODO: Build client that connects to /hubs/ticker with SignalR, auto-reconnect enabled
// TODO: On 'Subscribed', log a message
// TODO: Handle 'PriceUpdate' to update a table row per symbol
// TODO (Part D): Add a heartbeat 'Ping' every 5s and compute RTT on 'Pong'

const stateEl = document.getElementById('state');
const latEl = document.getElementById('latency');
const rateEl = document.getElementById('rate');
const tableBody = document.getElementById('table');

function upsertRow(symbol, price, time) {
  // TODO: create/find table row and update price/time
}

document.getElementById('connect').addEventListener('click', async () => {
  // TODO: connect and invoke Subscribe(symbol)
});

document.getElementById('hf').addEventListener('click', async () => {
  // TODO: invoke SetMode('high'|'normal')
});