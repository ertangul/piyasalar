import axios from 'axios';

const config = {
  differance_rate:            0.5,
  api: {
    baseUrl:                  'https://api.ratesapi.io/api/',
    path:                     'latest',
    base:                     'TRY',
    symbols:                  'USD,EUR,JPY,GBP,DKK,NOK'
  },
  foreign_currency: {
    default:                  'USD',
    selected:                 '',
    reverse:                  false
  }
}

let   translator_currency     = config.foreign_currency.selected ? config.foreign_currency.selected : config.foreign_currency.default;
let   currency_base           = config.api.base;


const _apiEndPoint            = config.api.baseUrl + config.api.path + '?base=';
const api                     = _apiEndPoint + currency_base + '&symbols=' + config.api.symbols;

const allTableItems           = document.querySelectorAll('.exchange-table__item');
const foreignCurrencySelect   = document.querySelector('select[name="currency_unit"]');
const currency_toggle         = document.querySelector('.toggle-currency');
let   translatorInput         = document.querySelectorAll('.translator-app input')[0];
let   translatorOutput        = document.querySelectorAll('.translator-app input')[1];

translatorInput.onkeyup       = translatorAppHandle;

window.addEventListener('load', () => {
  tableInit();
});

foreignCurrencySelect.addEventListener('change', (event) => {
  if(translatorInput.name == 'all_currency') {
    translator_currency = event.target.value.toUpperCase();
  } else {
    currency_base = event.target.value.toUpperCase();
  }
  if(translatorInput.value.length) {
    translatorCurrency(translatorInput.value);
  }
});

currency_toggle.addEventListener('click', (event) => {
  let in_out_elements = event.target.closest('.translator-app').childNodes;
  // View
  translatorInput.removeAttribute('placeholder');
  translatorOutput.setAttribute('placeholder', 'Sayı giriniz');
  // Funncionality
  translatorInput.setAttribute('readonly', '');
  translatorOutput.removeAttribute('readonly');
  translatorInput.onkeyup = null;
  // Swap
  swapElements(in_out_elements[0], in_out_elements[2]);
  // After Swap
  translatorInput= document.querySelectorAll('.translator-app input')[0];
  translatorOutput= document.querySelectorAll('.translator-app input')[1];
  let _currency_base = currency_base;
  currency_base = translator_currency;
  translator_currency = _currency_base;
  translatorInput.onkeyup= translatorAppHandle;

});

function tableInit() {
  axios.get(api).then(res => {
    const rates = res.data.rates;
    allTableItems.forEach(e => {  
      e.querySelector('.item-buying > .value').textContent = priceRegulator('buying', rates[e.dataset.unit]);
      e.querySelector('.item-sales > .value').textContent = priceRegulator('sales', rates[e.dataset.unit]);
    })
  }).catch(() => console.error('Exchange rates could not be fetched.'));
}

function priceRegulator(type, refPrice, quantity = 1){
  let price;
  const translatedPrice = 1 / refPrice;
  const differedRate = translatedPrice * config.differance_rate / 100;
  if(type == 'buying') {
    price = translatedPrice + differedRate
  } else if (type == 'sales') {
    price = translatedPrice - differedRate
  } else {
    price = translatedPrice
  }
  price = price * quantity;
  return price.toFixed(6)
}

function translatorAppHandle(e){
  let entryValue = e.target.value;
  console.log('asdas', entryValue);
  if(entryValue.length) {
    translatorCurrency(entryValue);
  } else {
    translatorOutput.value = '';
  }
}


async function getForeignCurrency() {
  let apiUrl = _apiEndPoint + currency_base + '&symbols=' + translator_currency;
  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch(error) {
    console.log("error", error);
  }
}

function translatorCurrency(input_quantity){
  if(translatorInput.name == 'all_currency') {
    getForeignCurrency().then(res => {
      let price = Object.values(res.rates)[0];
      translatorOutput.value = priceRegulator('buying', price, input_quantity);
    });
  } else {
    getForeignCurrency().then(res => {
      let price = Object.values(res.rates)[0];
      translatorOutput.value = priceRegulator('sales', price, input_quantity);
    });
  }
}

function swapElements(obj1, obj2) {
  var temp = document.createElement("div");
  obj1.parentNode.insertBefore(temp, obj1);
  obj2.parentNode.insertBefore(obj1, obj2);

  temp.parentNode.insertBefore(obj2, temp);
  temp.parentNode.removeChild(temp);
}