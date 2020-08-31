var intervalExpityTimer
async function generateCurrencyComponent() {
    const currencyComponent = document.querySelector("#currency-exhange-component");
    const titleComponent = createHtmlElement("h3", "", "title-currency-exchange", "");
    titleComponent.innerHTML = `<i class="fa fa-line-chart" aria-hidden="true"></i> Currecncy Exchange`
    currencyComponent.appendChild(titleComponent);
    const componentItemContainerAmmout = createHtmlElement("div", "", "currency-component-item", "");
    const inputAmount = createHtmlElement("input", "amount-input", "currency-input", "");
    inputAmount.addEventListener("input", (e) => { handleAmountInput(e.target); });
    inputAmount.placeholder = "Enter amount";
    inputAmount.value = "1";
    const imgAmount = createHtmlElement("img", "", "country-flag-image", "");
    const selectionCurrencyAmount = createHtmlElement("select", "amount-selection", "currency-selection", "");
    selectionCurrencyAmount.addEventListener("change", (e) => { handleChangeCurrency(e); });
    const errorMessageAmount = createHtmlElement("label", "", "error-message", "");
    componentItemContainerAmmout.appendChild(imgAmount);
    componentItemContainerAmmout.appendChild(selectionCurrencyAmount);
    componentItemContainerAmmout.appendChild(inputAmount);
    componentItemContainerAmmout.appendChild(errorMessageAmount);
    const componentItemContainerResult = createHtmlElement("div", "", "currency-component-item", "");
    const inputResult = createHtmlElement("input", "result-input", "currency-input", "");
    inputResult.placeholder = "Enter amount";
    const imgResult = createHtmlElement("img", "", "country-flag-image", "");
    inputResult.addEventListener("input", (e) => { handleInput(e); });
    const selectionCurrencyResult = createHtmlElement("select", "result-selection", "currency-selection", "");
    selectionCurrencyResult.addEventListener("change", (e) => { handleChangeCurrency(e); });
    const errorMessageResult = createHtmlElement("label", "", "error-message", "");
    componentItemContainerResult.appendChild(imgResult);
    componentItemContainerResult.appendChild(selectionCurrencyResult);
    componentItemContainerResult.appendChild(inputResult);
    componentItemContainerResult.appendChild(errorMessageResult);
    const componentItemContainerButton = createHtmlElement("div", "", "currency-component-item", "");
    const exchangeBtn = createHtmlElement("button", "exchange-btn", "currency-exchange-btn", "Exchange");
    exchangeBtn.disabled = true;
    exchangeBtn.addEventListener("click", handleExchangeCurrency);
    const exchangeMessage = createHtmlElement("p", "", "exchange-message", "");
    const countDownContainer = createHtmlElement("div", "", "countdown-container", "");
    const minutesParent = createHtmlElement("div", "", "minutes-parent", "");
    const secondsParent = createHtmlElement("div", "", "seconds-parent", "");
    const minutes = createHtmlElement("span", "minutes-count-down", "minutes-count-down", "");
    const seconds = createHtmlElement("span", "seconds-count-down", "seconds-count-down", "");
    minutesParent.appendChild(minutes);
    secondsParent.appendChild(seconds);
    countDownContainer.appendChild(minutesParent);
    countDownContainer.appendChild(secondsParent);
    componentItemContainerButton.appendChild(exchangeMessage);
    componentItemContainerButton.appendChild(countDownContainer);
    componentItemContainerButton.appendChild(exchangeBtn);
    const conversionRateDisplayContainer = createHtmlElement("button", "rate-display", "rate-display-container", "");
    const exhangeRate = createHtmlElement("span", "rate-display", "rate-display", "1 GBP = 1.0000 GBP");
    conversionRateDisplayContainer.innerHTML = '<i class="fa fa-line-chart" aria-hidden="true"></i>';
    const reverseBtn = createHtmlElement("button", "reverse-btn", "reverse-btn", "");
    reverseBtn.innerHTML = `<i class="fa fa-arrows-v" aria-hidden="true"></i>`;
    reverseBtn.addEventListener("click", handleReverseCurrenciesButtonclick);
    conversionRateDisplayContainer.appendChild(exhangeRate);
    componentItemContainerAmmout.appendChild(reverseBtn);
    componentItemContainerAmmout.appendChild(conversionRateDisplayContainer);
    currencyComponent.appendChild(componentItemContainerAmmout);
    currencyComponent.appendChild(componentItemContainerResult);
    currencyComponent.appendChild(componentItemContainerButton);
    var rates = await getExchangeRateFromApi("GBP");
    addOptionsToSelectElements(rates);
    selectionCurrencyResult.selectedIndex = 3;
    imgAmount.src = selectionCurrencyAmount.options[selectionCurrencyAmount.selectedIndex].dataset.dataImage;
    imgResult.src = selectionCurrencyResult.options[selectionCurrencyResult.selectedIndex].dataset.dataImage;
    inputAmount.focus();
    handleAmountInput(inputAmount);
    return intervalExpityTimer
}

generateCurrencyComponent();

function handleExchangeCurrency(e) {
    clearInterval(intervalExpityTimer);
    const inputAmountCalue = document.querySelector("#amount-input").value;
    const selectedCurrencyAmount = document.querySelector("#amount-selection").options[document.querySelector("#amount-selection").selectedIndex].innerText
    const inputResultValue = document.querySelector("#result-input").value;
    const selectedCurrencyResult = document.querySelector("#result-selection").options[document.querySelector("#result-selection").selectedIndex].innerText
    document.querySelector(".exchange-message").innerText = `${inputAmountCalue} ${selectedCurrencyAmount} is equivalent to ${inputResultValue} ${selectedCurrencyResult}`;
    changeTimerText(10, 0, 0, 0);
    startExpiryTimer(10, 0)
}

function handleReverseCurrenciesButtonclick() {
    const selectionMenus = document.querySelectorAll(".currency-selection");
    const selectedIndexToConvertFrom = selectionMenus[0].selectedIndex;
    const selectedIndexToConvertTo = selectionMenus[1].selectedIndex;
    selectionMenus[0].selectedIndex = selectedIndexToConvertTo
    selectionMenus[0].previousElementSibling.src = selectionMenus[0].options[selectedIndexToConvertTo].dataset.dataImage;
    selectionMenus[1].selectedIndex = selectedIndexToConvertFrom;
    selectionMenus[1].previousElementSibling.src = selectionMenus[1].options[selectedIndexToConvertFrom].dataset.dataImage;
    if (!isNaN(selectionMenus[0].nextElementSibling.value)) doCurrencyConversion(selectionMenus[0].nextElementSibling);
}

function handleChangeCurrency(e) {
    const inputAmount = document.querySelector("#amount-input");
    const value = inputAmount.value;
    const image = e.target.previousElementSibling;
    image.src = e.target.options[e.target.selectedIndex].dataset.dataImage;
    if (!isNaN(value)) doCurrencyConversion(inputAmount);
}

function handleAmountInput(element) {
    const value = element.value;
    const errorMsg = element.nextElementSibling;
    const exchangeBtn = document.querySelector(".currency-exchange-btn");
    isNaN(value) && value ? (errorMsg.innerHTML = "Enter a valid amount") : (errorMsg.innerHTML = "");
    if (!isNaN(value) && value) doCurrencyConversion(element);
    !isNaN(value) && value ? (exchangeBtn.disabled = false) : (exchangeBtn.disabled = true);
}

async function doCurrencyConversion(inputElement) {
    var otherInput;
    const selectedCurrencyMenu = inputElement.previousElementSibling.options[inputElement.previousElementSibling.selectedIndex].innerText;
    document.querySelectorAll(".currency-input").forEach((e) => {
        if (e.id != inputElement.id) otherInput = e;
    });
    const convertCurrency = otherInput.previousElementSibling.options[otherInput.previousElementSibling.selectedIndex].innerText;
    const data = await getExchangeRateFromApi(selectedCurrencyMenu);
    const result = Number(inputElement.value) * data[convertCurrency];
    otherInput.value = result.toFixed(4);
    updateRateDisplay(selectedCurrencyMenu, convertCurrency, result);
}

function updateRateDisplay(selectedCurrency, convertCurrency, rate) {
    const exhangeRate = document.querySelector(".rate-display");
    exhangeRate.innerText = `1 ${selectedCurrency} =  ${rate.toFixed(4)} ${convertCurrency}`;
}

function createHtmlElement(tagname, id, className, innerText) {
    const element = document.createElement(tagname);
    element.className = className;
    if (id) element.id = id;
    if (innerText) element.innerText = innerText;
    return element;
}

async function getExchangeRateFromApi(currency) {
    var response = await fetch(`https://api.exchangerate-api.com/v4/latest/${currency}`);
    if (response.ok) {
        let json = await response.json();
        return json.rates;
    } else {
        alert("HTTP Request Failed: " + response.status);
    }
}

function addOptionsToSelectElements(obj) {
    const selectionMenus = document.querySelectorAll(".currency-selection");
    for (const [key, value] of Object.entries(obj)) {
        selectionMenus.forEach((e) => {
            addOptionToSelectionElement(e, key);
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

function startExpiryTimer(minutes, seconds) {
    const curencyExchange = document.querySelector(".exchange-message")
    const countdownContainer = document.querySelector(".countdown-container");
    countdownContainer.style.display = "flex";
    var counterSeconds = 0;
    var counterMinutes = 0;
    intervalExpityTimer = setInterval(() => {
        counterSeconds++;
        if (seconds == 0) {
            if (minutes == 0) {
                clearInterval(intervalExpityTimer);
                countdownContainer.style.display = "none";
                curencyExchange.innerText = "";
                return;
            }
            counterMinutes++;
            minutes--;
            seconds = 59;
        } else { seconds--; }
        changeTimerText(minutes, seconds, counterSeconds, counterMinutes);
    }, 1000);
}

function changeTimerText(minutes, seconds, counterSeconds, counterMinutes) {
    const minutesCont = document.querySelector(".minutes-count-down");
    const secondsCont = document.querySelector(".seconds-count-down");
    if (minutesCont.innerText != minutes.toString() + "'") minutesCont.style.transform = `rotateX(${180 * counterMinutes}deg) scale(1,${Math.pow(-1, counterMinutes)})`;
    if (secondsCont.innerText != seconds.toString() + '"') secondsCont.style.transform = `rotateX(${180 * counterSeconds}deg) scale(1,${Math.pow(-1, counterSeconds)})`;
    minutesCont.innerText = `${minutes}'`;
    secondsCont.innerText = `${seconds}"`;
}
