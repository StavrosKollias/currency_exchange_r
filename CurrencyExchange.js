async function generateCurrencyComponent() {
   const currencyComponent = document.querySelector("#currency-exhange-component");
   const componentItemContainerAmmout = createHtmlElement("div", "", "currency-component-item", "");
   const inputAmount = createHtmlElement("input", "amount-input", "currency-input", "");
   const imgAmount = createHtmlElement("img", "", "country-flag-image", "");
   imgAmount.placeholder = "0";
   inputAmount.addEventListener("input", (e) => {
      handleInput(e);
   });
   const selectionCurrencyAmount = createHtmlElement("select", "amount-selection", "currency-selection", "");

   selectionCurrencyAmount.addEventListener("change", (e) => {
      handleChangeCurency(e);
   });
   componentItemContainerAmmout.appendChild(imgAmount);
   componentItemContainerAmmout.appendChild(selectionCurrencyAmount);
   componentItemContainerAmmout.appendChild(inputAmount);
   const componentItemContainerResult = createHtmlElement("div", "", "currency-component-item", "");
   const inputResult = createHtmlElement("input", "result-input", "currency-input", "");
   inputResult.placeholder = "0";
   const imgResult = createHtmlElement("img", "", "country-flag-image", "");

   inputResult.addEventListener("input", (e) => {
      handleInput(e);
   });
   const selectionCurrencyResult = createHtmlElement("select", "result-selection", "currency-selection", "");
   selectionCurrencyResult.addEventListener("change", (e) => {
      handleChangeCurency(e);
   });
   componentItemContainerResult.appendChild(imgResult);
   componentItemContainerResult.appendChild(selectionCurrencyResult);
   componentItemContainerResult.appendChild(inputResult);
   const componentItemContainerButton = createHtmlElement("div", "", "currency-component-item", "");
   const exchangeBtn = createHtmlElement("button", "exchange-btn", "currency-exchange-btn", "Exchange");
   exchangeBtn.disabled = true;
   const errorMessage = createHtmlElement("p", "", "error-message", "");
   componentItemContainerButton.appendChild(errorMessage);
   componentItemContainerButton.appendChild(exchangeBtn);
   const conversionRateDisplay = createHtmlElement("span", "rate-display", "rate-display", "1 = 1.359");
   const reverseBtn = createHtmlElement("button", "reverse-btn", "reverse-btn", "<>");
   reverseBtn.innerHTML = `<i class="fa fa-arrows-v" aria-hidden="true"></i>`;
   componentItemContainerAmmout.appendChild(reverseBtn);
   componentItemContainerAmmout.appendChild(conversionRateDisplay);
   currencyComponent.appendChild(componentItemContainerAmmout);
   currencyComponent.appendChild(componentItemContainerResult);
   currencyComponent.appendChild(componentItemContainerButton);
   var rates = await getApiData("https://api.exchangerate-api.com/v4/latest/GBP");
   loopThroughObjectDataForSelections(rates, addOptionToSelectionElement);
   imgAmount.src = selectionCurrencyAmount.options[selectionCurrencyAmount.selectedIndex].dataset.dataImage;
   imgResult.src = selectionCurrencyResult.options[selectionCurrencyResult.selectedIndex].dataset.dataImage;
   inputAmount.focus();
}

generateCurrencyComponent();

function handleChangeCurency(e) {
   const image = e.target.previousElementSibling;
   image.src = e.target.options[e.target.selectedIndex].dataset.dataImage;
}

function handleInput(e) {
   const value = e.target.value;
   const errorMsg = document.querySelector(".error-message");
   isNaN(value) ? (errorMsg.innerHTML = "Enter a valid amount") : (errorMsg.innerHTML = "");
   !isNaN(value) ? doCurrencyConversion(e.target) : false;
}

function doCurrencyConversion(inputElement) {
   var otherInput;
   const amountToConvert = Number(inputElement.value);
   const selectedCurrencyMenu = inputElement.previousElementSibling;
   const selectedCurrency = selectedCurrencyMenu.options[selectedCurrencyMenu.selectedIndex].innerText;
   document.querySelectorAll(".currency-input").forEach((e) => {
      e.id != inputElement.id ? (otherInput = e) : false;
   });
   const convertCurrency = otherInput.previousElementSibling.options[otherInput.previousElementSibling.selectedIndex].innerText;
   const data = getApiData("https://api.exchangerate-api.com/v4/latest/GBP").then((data) => {
      const newCurency = 1 / data[selectedCurrency];
      const result = amountToConvert * data[convertCurrency] * newCurency;
      otherInput.value = result.toFixed(4);
   });
}

function createHtmlElement(tagname, id, className, innerText) {
   const element = document.createElement(tagname);
   element.className = className;
   id ? (element.id = id) : false;
   innerText ? (element.innerText = innerText) : false;
   return element;
}

async function getApiData(url) {
   var response = await fetch(url);
   if (response.ok) {
      let json = await response.json();
      return json.rates;
   } else {
      alert("HTTP Request Failed: " + response.status);
   }
}

function loopThroughObjectDataForSelections(obj, operationFunction) {
   const selectionMenus = document.querySelectorAll(".currency-selection");
   for (const [key, value] of Object.entries(obj)) {
      selectionMenus.forEach((e) => {
         operationFunction(e, key);
      });
   }
}

function addOptionToSelectionElement(element, value) {
   const option = createHtmlElement("option", "", "currency-option", value);
   const flagName = value.substring(0, value.length - 1).toLowerCase();
   option.dataset.dataImage = `https://www.countryflags.io/${flagName}/flat/64.png`;
   option.value = element.children.length;
   element.appendChild(option);
}
