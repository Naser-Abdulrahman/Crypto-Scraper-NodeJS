let ws = null;
let url = "ws://localhost:8080";
let price = null;
let latestTime = null;
let symbol = null;
let fiatCurrency = null;


let cryptoExchangeSelect = document.getElementById("exchange");
let crypto_currency_select = document.getElementById("crypto_currency");
let symbolRequest = crypto_currency_select.value;
let supportedCryptoCurrencies = { binance: ["BSV", "CRO"], 
bitstamp: ["BNB", "USDT", "DOGE", "ADA", "DOT", "UNI", "VET", "THETA", "FIL", "TRX", "SOL", "WBTC", "NEO", "XMR", "EOS", "BSV", "LUNA", "IOTA", "CRO", "FTT"],
bittrex: ["BNB", "XRP", "DOT", "VET", "THETA", "SOL", "WBTC", "XMR", "LUNA", "CRO", "FTT", "AAVE", "DASH"],
coinbasepro: ["BNB", "XRP", "USDT", "DOGE", "DOT", "VET", "THETA", "USDC", "TRX", "SOL", "NEO", "XMR", "BSV", "LUNA", "IOTA", "CRO", "FTT"],
kraken: ["BNB", "DOGE", "VET", "THETA", "SOL", "WBTC", "NEO", "BSV", "LUNA", "IOTA", "CRO", "FTT"]};

cryptoExchangeSelect.addEventListener("click", cryptoUpdater)
function cryptoUpdater(){
cryptoExchange =
    cryptoExchangeSelect.options[cryptoExchangeSelect.selectedIndex].value;
for (let i = 0; i < crypto_currency_select.length; i++) {
let setter = crypto_currency_select[i];
let checker = setter.value;
if (supportedCryptoCurrencies[cryptoExchange].includes(checker)) {
    setter.disabled = true;
} else {
    setter.disabled = false;
    }
}
}
function connect() {
    console.log(`Connecting to web socket url: ${url}`);
    try {
        var ws = new WebSocket(url);
    } catch (e) {
        console.log(e);
    }
    ws.onmessage = function (event) {

        console.log(`Websocket message: ${event.data}`);
        let received = event.data.split(":");
        price = received[1].split(",")[0];
        latestTime = received[2] + received[3] + received[4].split(",")[0]
        symbol = received[5].split("}")[0]

        let fiatCurrencySelect = document.getElementById("fiat_currency");
        fiatCurrency =  fiatCurrencySelect.options[fiatCurrencySelect.selectedIndex].value;
        symbolRequest = crypto_currency_select.value
        cryptoExchange =    cryptoExchangeSelect.options[cryptoExchangeSelect.selectedIndex].value;
        let count = document.getElementById("myTable").rows.length;
        let req = {
            exchange: cryptoExchange,
            sym: symbolRequest,
            fiat: fiatCurrency,
        };
        console.log("sending " + JSON.stringify(req))
        ws.send(
            JSON.stringify(req)
        );
        if (
            price != null &&
            latestTime != null &&
            symbol != null &&
            fiatCurrency != null &&
            cryptoExchange != null
        ) {
            if (count == 5) {
                document.getElementById("myTable").deleteRow(4);
            }
            let table = document.getElementById("myTable");
            let row = table.insertRow(0);
            let cellTime = row.insertCell(0); //last cell at 0 index
            let cellSymbol = row.insertCell(1); //at 
            let cellFiat = row.insertCell(2);
            let cellExchange = row.insertCell(3);
            let cellPrice = row.insertCell(4);
            let cellDifference = row.insertCell(5)
            if (table.rows[1] == null){
                cellDifference.innerHTML = 0;
            } else {
            let oldValue = table.rows[1].cells[4].innerHTML
            let diff = price.replace(/['"]+/g, '') - oldValue.replace(/['"]+/g, '');
            cellDifference.innerHTML = diff;
            }

            cellTime.innerHTML = latestTime;
            cellSymbol.innerHTML = symbol;
            cellPrice.innerHTML = price;
            cellExchange.innerHTML = cryptoExchange;
            cellFiat.innerHTML = fiatCurrency;
            price, latestTime, symbol = null;
        }
    };
    ws.onopen = function (ws) {
        console.log("Connected m8");
    };
    ws.onclose = function () {
        console.log("Connection closed");
    };
}

connect();