async function fetchWeather(city, forecast) {
    try {
        let data;
        let response = await fetch(`https://api.weatherapi.com/v1/${forecast}.json?key=b35580b5b878478fba522539232904&q=${city}&days=3`, {
            mode: "cors",
        });
        if (response.ok) {
            data = await response.json();
        } else {
            throw new Error("Please enter a valid city name");
        }
        return data;
    } catch (err) {
        console.log("there was an error " + err);
        const div = document.querySelector(".jsonDATA");
        div.textContent = "Location not found";
        // const img = document.querySelector("img");
        // img.src = "";
    }
}

async function fetchLocation(city) {
    try {
        let data;
        let response = await fetch(`https://api.weatherapi.com/v1/search.json?key=b35580b5b878478fba522539232904&q=${city}`, {
            mode: "cors",
        });
        if (response.ok) {
            data = await response.json();
        } else {
            throw new Error("Please enter a valid city name");
        }
        return data;
    } catch (err) {
        const suggBox = document.querySelector(".autocom-box");
        suggBox.classList.add("hidden");
        console.log("there was an error " + err);
        const div = document.querySelector(".jsonDATA");
        div.textContent = "Location not found";

        // const img = document.querySelector("img");
        // img.src = "";
    }
}

function getData(data, weatherBoolean) {
    const div = document.querySelector(".jsonDATA");
    // div.textContent = data;
    const currentImg = data.current.condition.icon;
    // let currentTemp = data.current.temp_f;
    // const currentTemp = data.current.temp_f;
    let currentTemp;
    let tempUnit;
    if (weatherBoolean) {
        currentTemp = Math.round(data.current.temp_c);
        tempUnit = "\xB0C";
    } else {
        currentTemp = Math.round(data.current.temp_f);
        tempUnit = "\xB0F";
    }
    const currentTempDiv = document.querySelector(".currentTemp");
    const currentTempDiv2 = document.querySelector(".currentTemp2");
    const currentTempDiv3 = document.querySelector(".currentTemp3");
    const cityName = document.querySelector(".cityName");
    // currentTempDiv.textContent = currentTemp + data.location.name;
    cityName.textContent = data.location.name + ", " + data.location.region;
    currentTempDiv.textContent = `${printCurrentDay(data, 0, "forecast")}, ${currentTemp}${tempUnit}`;
    currentTempDiv2.textContent = printTempData(data, 1, weatherBoolean);
    currentTempDiv3.textContent = printTempData(data, 2, weatherBoolean);
    console.log(data);
    const img = document.querySelector("img");
    img.src = currentImg;
    // console.log(JSON.parse(data));
    // currentWeather(data);
    // printTempData(data, 0);
    // printTempData(data, 1);
    // printTempData(data, 2);

    // console.log(data.forecast.forecastday[0]);

    // const date = new Date(`${data["location"]["forecast"]["forecastday"][0]}`);
    // console.log(data)
    // console.log(dt);
}

async function getCurrentWeather() {
    const data = await fetchWeather("New York City", "current");
    const size = new TextEncoder().encode(JSON.stringify(data)).length;
    const kiloBytes = size / 1024;
    const megaBytes = kiloBytes / 1024;
    console.log(kiloBytes);
    currentWeather(data);
    console.log(data);
}

function currentWeather(data) {
    const dayZero = printCurrentDay(data, 0, "current");
    let last_updated = data.current.last_updated;
    let temp_c = data.current.temp_c;
    console.log(`day: ${dayZero}, last updated: ${last_updated}, temperature: ${temp_c}\xB0C`);
}

function printTempData(data, currentDayInt, weatherBoolean) {
    const dayString = printCurrentDay(data, currentDayInt, "forecast");
    let min_temp;
    let max_temp;
    // min_temp = data.forecast.forecastday[currentDayInt].day.mintemp_f;
    // max_temp = data.forecast.forecastday[currentDayInt].day.maxtemp_f;
    let tempUnit;
    if (weatherBoolean) {
        min_temp = Math.round(data.forecast.forecastday[currentDayInt].day.mintemp_c);
        max_temp = Math.round(data.forecast.forecastday[currentDayInt].day.maxtemp_c);
        tempUnit = "\xB0C";
    } else {
        min_temp = Math.round(data.forecast.forecastday[currentDayInt].day.mintemp_f);
        max_temp = Math.round(data.forecast.forecastday[currentDayInt].day.maxtemp_f);
        tempUnit = "\xB0F";
    }
    let condition = data.forecast.forecastday[currentDayInt].day.condition.text;
    let returnData = `${dayString}, high temp: ${max_temp}${tempUnit}, low temp: ${min_temp}${tempUnit}, condition: ${condition}`;
    return returnData;
}

function printCurrentDay(data, currentDayInt, forecastType) {
    let currentDay;
    if (forecastType === "forecast") {
        currentDay = data.forecast.forecastday[currentDayInt].date;
    } else {
        currentDay = new Date();
    }
    const zone = new Date().getTimezoneOffset() / 60;
    const dt = new Date(`${currentDay} GMT-${zone}`);
    const dayInt = dt.getDay();
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "December"];
    const getDay = dayNames[dt.getDay()];
    const getMonth = monthNames[dt.getMonth()];
    const getMonthDay = dt.getDate();
    const getYear = dt.getFullYear();
    let getMonthDaySplit = String(getMonthDay).split("");
    let currentDate = `${getDay}, ${getMonth} ${getMonthDay}${nthNumber(getMonthDay)}, ${getYear}`;
    return currentDate;
}

const nthNumber = (number) => {
    if (number > 3 && number < 21) return "th";
    switch (number % 10) {
        case 1:
            return "st";
        case 2:
            return "nd";
        case 3:
            return "rd";
        default:
            return "th";
    }
};

async function receiveData(city) {
    const data = await fetchWeather(city, "forecast");
    return data;
}

function submitData() {
    const cityInput = document.getElementById("city");
    const suggBox = document.querySelector(".autocom-box");

    document.querySelector("form").addEventListener("submit", async (e) => {
        const weatherInput = document.getElementById("weatherUnits");

        e.preventDefault();
        const data = await fetchWeather(cityInput.value, "forecast");
        let weatherBoolean = JSON.parse(localStorage.getItem("weatherBoolean"));
        getData(data, weatherBoolean);
        document.querySelector("form").reset();
        suggBox.classList.add("hidden");
        // weatherInput.checked = false;
    });
    clickList();
}

function clickList() {
    const suggList = document.querySelectorAll(".autocom-box li");
    const suggBox = document.querySelector(".autocom-box");
    suggList.forEach((list) => {
        list.addEventListener("click", async (e) => {
            const weatherInput = document.getElementById("weatherUnits");

            const cityInput = document.getElementById("city");
            cityInput.value = e.target.textContent;
            const data = await fetchWeather(cityInput.value, "forecast");
            let weatherBoolean = JSON.parse(localStorage.getItem("weatherBoolean"));
            console.log(weatherBoolean);
            getData(data, weatherBoolean);
            document.querySelector("form").reset();
            suggBox.classList.add("hidden");
            // weatherInput.checked = false;
        });
    });
}

function renderResults(results) {
    const suggBox = document.querySelector(".autocom-box");

    if (!results.length) {
        return suggBox.classList.add("hidden");
    } else {
        for (let i = 0; i < results.length; i++) {
            const rowItem = document.createElement("li");
            rowItem.textContent = results[i];
            suggBox.append(rowItem);
        }
        const div = document.querySelector(".jsonDATA");
        div.textContent = "";
        return suggBox.classList.remove("hidden");
    }
}

// function toggleUnits()

function toggleUnits() {
    let weatherBoolean = JSON.parse(localStorage.getItem("weatherBoolean")) || false;
    localStorage.setItem("weatherBoolean", weatherBoolean);

    const weatherInput = document.getElementById("weatherUnits");
    weatherInput.addEventListener("click", async () => {
        const cityName = document.querySelector(".cityName");
        const data = await fetchWeather(cityName.textContent, "forecast");

        if (weatherInput.checked) {
            weatherBoolean = true;
            localStorage.setItem("weatherBoolean", weatherBoolean);
            getData(data, weatherBoolean);
        } else {
            weatherBoolean = false;
            localStorage.setItem("weatherBoolean", weatherBoolean);

            getData(data, weatherBoolean);
        }
    });
    console.log(weatherBoolean);
    return weatherBoolean;
}

function renderDOM() {
    const suggBox = document.querySelector(".autocom-box");
    suggBox.classList.add("hidden");
    let weatherBoolean = JSON.parse(localStorage.getItem("weatherBoolean"));
    let weatherUnits = document.getElementById("weatherUnits");
    weatherUnits.checked = weatherBoolean;
    return weatherBoolean;
}

export function runAPI() {
    toggleUnits();
    const cityInput = document.getElementById("city");
    submitData();
    window.addEventListener("DOMContentLoaded", async () => {
        let weatherBoolean = renderDOM();
        const data = await fetchWeather("new york city", "forecast");
        getData(data, weatherBoolean);
        getCurrentWeather();
    });

    cityInput.addEventListener("keyup", async (e) => {
        const autocomplete = await fetchLocation(e.target.value);
        console.log(autocomplete);
        let locationsArray = [];
        if (cityInput.value.length) {
            for (let i = 0; i < autocomplete.length; i++) {
                let oneRow = `${autocomplete[i].name}, ${autocomplete[i].region}, ${autocomplete[i].country}`;
                locationsArray.push(oneRow);
            }
            suggBox.innerHTML = "";
            renderResults(locationsArray);
            clickList();
            //  = emptyArray;
        }
    });
}
