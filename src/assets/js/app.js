import axios from 'axios';

const config = {
  differance_rate: 0.5,
  api: {
    baseUrl: 'https://api.ratesapi.io/api/',
    path: 'latest',
    base: 'TRY',
    symbols: 'USD,EUR,JPY,GBP,DKK,NOK'
  },
  foreign_currency: {
    default: 'USD',
    selected: ''
  }
}

let translator_currency = config.foreign_currency.selected ? config.foreign_currency.selected : config.foreign_currency.default;

const api = config.api.baseUrl + config.api.path + '?base=' + config.api.base + '&symbols=' + config.api.symbols;
const translateApi = config.api.baseUrl + config.api.path + '?base=' + config.api.base + '&symbols=';

const allTableItem = document.querySelectorAll('.exchange-table__item');
const translatorInput = document.querySelectorAll('.translator-app input')[0];
const foreignCurrencySelect = document.querySelector('select[name="currency_unit"]');
const translatorOutput = document.querySelectorAll('.translator-app input')[1];

window.addEventListener('load', () => {
  tableInit();
});

foreignCurrencySelect.addEventListener('change', (event) => {
  translator_currency = event.target.value.toUpperCase();
});


function tableInit() {
  axios.get(api).then(res => {
    const rates = res.data.rates;
    allTableItem.forEach(e => {  
      e.querySelector('.item-buying > .value').textContent = buyPrice(rates[e.dataset.unit]);
      e.querySelector('.item-sales > .value').textContent = sellPrice(rates[e.dataset.unit]);
    })
  }).catch(() => console.error('Exchange rates could not be fetched.'));
}

function buyPrice(refPrice) {
  let translatedPrice = 1 / refPrice;
  let buyingPrice = translatedPrice + (translatedPrice * config.differance_rate / 100);
  return buyingPrice.toFixed(6)
}
function sellPrice(refPrice) {
  let translatedPrice = 1 / refPrice;
  let sellingPrice = translatedPrice - (translatedPrice * config.differance_rate / 100);
  return sellingPrice.toFixed(6)
}

