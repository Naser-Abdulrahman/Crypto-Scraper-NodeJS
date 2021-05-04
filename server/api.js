const WebSocket = require("ws");
const Shrimpy = require("shrimpy-node");

const { convert } = require('exchange-rates-api');
const { logger } = require("./logger");
const { sleep } = require("./utils");

const { PUBLIC_KEY, PRIVATE_KEY, URL, PORT } = require("./config");
console.log(`Websocket server running on: ${URL}:${PORT}`);

const wss = new WebSocket.Server({ port: PORT });
let websocketList = [];
let clientExchange = null;
let clientSym = null;
let clientFiat = null;
let currencyConverted = null;

wss.on("connection", (ws) => {
  websocketList.push(ws);

  ws.on("message", (msg) => {
    console.log("data from client " + (msg));
    let splitter = msg.split(":")
    clientExchange = splitter[1].split(",")[0].replace(/['"]+/g, '');
    clientFiat = splitter[3].split("}")[0].replace(/['"]+/g, '');
    clientSym = splitter[2].split(",")[0].replace(/['"]+/g, '');
    if (clientExchange == "kraken" && clientSym == "BTC") {
      console.log("Changed bitcoin symbol")
      clientSym = "XBT";}
  });

  ws.on("close", () => {
    console.log("Websocket disconnected");
    websocketList.forEach((wsp) => {
      if (ws === wsp) console.log("Bye-Bye");
    });
    websocketList.pop();
  });
});

async function converting(usd){
  if (clientFiat == 'EURO'){
    let amount = convert(parseInt(usd), 'USD', 'EUR')
    amount.then(function(result){
      currencyConverted = result;
      return currencyConverted;
    })
  }else if (clientFiat == "JPN"){
    let amount = convert(parseInt(usd), 'USD', 'JPY')
    amount.then(function(result){
      currencyConverted = result;
      return currencyConverted
    })
  }
  else {
    let amount = convert(parseInt(usd), 'USD', clientFiat)
    amount.then(function(result){
      currencyConverted = result;
      return currencyConverted
    })
  }
}

(async () => {
  apiClient = new Shrimpy.ShrimpyApiClient(PUBLIC_KEY, PRIVATE_KEY);
  token = await apiClient.getToken();

  wsClient = new Shrimpy.ShrimpyWsClient(() => {
    console.error(error);
  }, token);

  wsClient.connect();
  console.log("Shrimpy websocket client connected");
  let i = 0;
  while (true) {
    if (clientExchange == null && clientSym == null && clientFiat == null){
    let ticker = await apiClient.getTicker("binance");
    usd = ticker[4].priceUsd;
    timestamp = ticker[4].lastUpdated;
    symbol = ticker[4].symbol; 
  }
    else {
      let newTicker = clientExchange;
    let ticker = await apiClient.getTicker(newTicker);
    ticker.forEach(Element => {
      if (Element.symbol == clientSym){
        usd = Element.priceUsd;
        timestamp = Element.lastUpdated
        symbol = Element.symbol
        usd = converting(usd); 
        usd = currencyConverted
      }
    }) 
    }
    cryptoCurrencyData = {
      price: usd,
      timestamp: timestamp,
      symbol: symbol
    };
    exchangeDataMessage = JSON.stringify(cryptoCurrencyData);
    if (websocketList[0] != null) {
      let wsp = websocketList[0];
      try {
        wsp.send(exchangeDataMessage);
      } catch (error) {
        console.error(e);
      }
    }
  }
})();
