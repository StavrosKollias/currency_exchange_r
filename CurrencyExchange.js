async function generateCurrencyComponent() {
   const currencyComponent = document.querySelector("#currency-exhange-component");
   const componentItemContainerAmmout = createHtmlElement("div", "", "currency-component-item", "");
   const inputAmount = createHtmlElement("input", "amount-input", "currency-input", "");
   const selectionCurrencyAmount = createHtmlElement("select", "amount-selection", "currency-selection", "");
   componentItemContainerAmmout.appendChild(selectionCurrencyAmount);
   componentItemContainerAmmout.appendChild(inputAmount);
   const componentItemContainerResult = createHtmlElement("div", "", "currency-component-item", "");
   const inputResult = createHtmlElement("input", "result-input", "currency-input", "");
   const selectionCurrencyResult = createHtmlElement("select", "result-selection", "currency-selection", "");
   componentItemContainerResult.appendChild(selectionCurrencyResult);
   componentItemContainerResult.appendChild(inputResult);
   const componentItemContainerButton = createHtmlElement("div", "", "currency-component-item", "");
   const exchangeBtn = createHtmlElement("button", "exchange-btn", "currency-exchange-btn", "Exchange");
   exchangeBtn.disabled = true;
   componentItemContainerButton.appendChild(exchangeBtn);
   const conversionRateDisplay = createHtmlElement("span", "rate-display", "rate-display", "1= 1.359");
   const reverseBtn = createHtmlElement("button", "reverse-btn", "reverse-btn", "<>");
   componentItemContainerAmmout.appendChild(reverseBtn);
   componentItemContainerAmmout.appendChild(conversionRateDisplay);
   currencyComponent.appendChild(componentItemContainerAmmout);
   currencyComponent.appendChild(componentItemContainerResult);
   currencyComponent.appendChild(componentItemContainerButton);
   var rates = await getApiData("https://api.exchangerate-api.com/v4/latest/GBP");
   loopThroughObjectDataForSelections(rates, addOptionToSelectionElement);
   inputAmount.focus();
}

generateCurrencyComponent();

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
   option.value = element.children.length;
   element.appendChild(option);
}
