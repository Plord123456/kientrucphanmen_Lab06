const connection = new signalR.HubConnectionBuilder() 
    .withUrl("/hubs/ticker")
    .withAutomaticReconnect() 
    .build();

const stateEl = document.getElementById('state');
const latEl = document.getElementById('latency');
const rateEl = document.getElementById('rate');
const tableBody = document.getElementById('table');
const logDiv = document.getElementById('log');


let msgCount = 0;
let msgRateInterval = null;
let currentMode = 'normal'; // Biến để theo dõi chế độ

// Cập nhật trạng thái UI khi kết nối thay đổi
connection.onclose(() => {
stateEl.innerText = 'disconnected';
    stateEl.className = 'badge disconnected'; 
    clearInterval(msgRateInterval);
});
connection.onreconnecting(() => { 
    stateEl.innerText = 'reconnecting...'; 
    stateEl.className = 'badge reconnecting'; 
});
connection.onreconnected(() => { 
    stateEl.innerText = 'connected'; 
    stateEl.className = 'badge connected'; 
});


// TODO: On 'Subscribed', log a message
connection.on("Subscribed", (message) => { //
    console.log("From server:", message);
    logDiv.innerHTML = `<div>${message}</div>` + logDiv.innerHTML; // Thêm vào đầu log
});

// TODO: Handle 'PriceUpdate' to update a table row per symbol
connection.on("PriceUpdate", (data) => { //
    msgCount++; // Đếm tin nhắn để tính rate
    upsertRow(data.symbol, data.price, new Date(data.serverTime).toLocaleTimeString());
});

// Xử lý sự kiện ModeChanged (từ Part B)
connection.on("ModeChanged", (mode) => {
    currentMode = mode;
    logDiv.innerHTML = `<div>SERVER: Mode changed to ${mode}</div>` + logDiv.innerHTML;
});

// TODO (Part D): Add a heartbeat 'Ping' every 5s and compute RTT on 'Pong'
connection.on("Pong", (clientTime) => { //
    const rtt = Date.now() - clientTime;
    latEl.innerText = `latency: ${rtt} ms`;
});

function startHeartbeat() {
    // Gửi Ping mỗi 5 giây
    setInterval(async () => {
        if (connection.state === signalR.HubConnectionState.Connected) {
            try {
                await connection.invoke("Ping", Date.now());
            } catch (err) {
                console.error("Ping failed: ", err);
            }
        }
    }, 5000);
}

function startRateCalculator() {
    msgCount = 0;
    clearInterval(msgRateInterval);
    msgRateInterval = setInterval(() => {
        rateEl.innerText = `rate: ${msgCount} msg/s`;
        msgCount = 0; // Reset bộ đếm
    }, 1000); // Cập nhật mỗi giây
}

function upsertRow(symbol, price, time) {
    // TODO: create/find table row and update price/time
    let row = document.getElementById(`row-${symbol}`); //
    
    if (!row) {
        // Nếu hàng chưa tồn tại, tạo hàng mới
        row = tableBody.insertRow(0); // Thêm vào đầu bảng
        row.id = `row-${symbol}`;
        
        row.insertCell(0).innerText = symbol; // Symbol
        row.insertCell(1).id = `price-${symbol}`; // Price
        row.insertCell(2).id = `time-${symbol}`; // Time
    }
    
    // Cập nhật giá và thời gian
    row.cells[1].innerText = price.toFixed(0); // Làm tròn giá
    row.cells[2].innerText = time;

    // Thêm hiệu ứng highlight
    row.style.backgroundColor = '#ffff99';
    setTimeout(() => {
        row.style.backgroundColor = 'transparent';
    }, 500);
}
function upsertRow(symbol, price, time) {
  let row = document.getElementById(`row-${symbol}`); 
    
  if (!row) {
    row = tableBody.insertRow(0);
    row.id = `row-${symbol}`;
        
    row.insertCell(0).innerText = symbol;
    row.insertCell(1).id = `price-${symbol}`;
    row.insertCell(2).id = `time-${symbol}`;
  }
    
  // Cập nhật giá và thời gian
  row.cells[1].innerText = price.toFixed(0);
  row.cells[2].innerText = time;

  // Thêm hiệu ứng highlight bằng CSS Class
  row.classList.add('highlight');
  setTimeout(() => {
      row.classList.remove('highlight');
  }, 750); // Phải khớp với thời gian animation trong CSS
}

document.getElementById('connect').addEventListener('click', async () => {
    // TODO: connect and invoke Subscribe(symbol)
    const symbol = document.getElementById('symbol').value; //
    
    try {
        if (connection.state === signalR.HubConnectionState.Disconnected) {
            await connection.start();
            stateEl.innerText = 'connected';
            stateEl.className = 'badge connected';
            logDiv.innerHTML = `<div>Connected.</div>` + logDiv.innerHTML;
            
            // Bắt đầu tính toán msg/s và ping
            startRateCalculator();
            startHeartbeat();
        }
        
        // Gửi yêu cầu subscribe
        await connection.invoke("Subscribe", symbol);

    } catch (err) {
        console.error(err);
        stateEl.innerText = 'connection failed';
        stateEl.className = 'badge disconnected';
    }
});

document.getElementById('hf').addEventListener('click', async () => {
    // TODO: invoke SetMode('high'|'normal')
    // Gửi chế độ MỚI
    let newMode = (currentMode === 'normal') ? 'high' : 'normal'; //
    try {
        if (connection.state === signalR.HubConnectionState.Connected) {
            await connection.invoke("SetMode", newMode);
        }
    } catch (err) {
        console.error("SetMode failed: ", err);
    }
});