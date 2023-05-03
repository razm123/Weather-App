import { searchLocations } from "./API/searchBar";
import { clickList } from "./API/searchBar";
import { toggleUnits } from "./DOM/tempUnits";
import { renderDOM } from "./DOM/tempUnits";
import { fetchWeather } from "./API/weatherData";
export function getData(data, weatherBoolean) {
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
    if (data.location.region != "") {
        cityName.textContent = data.location.name + ", " + data.location.region;
    } else {
        cityName.textContent = data.location.name + ", " + data.location.country;
    }
    currentTempDiv.textContent = `${printCurrentDay(data, 0, "forecast")}, ${currentTemp}${tempUnit}`;
    currentTempDiv2.textContent = printTempData(data, 1, weatherBoolean);
    currentTempDiv3.textContent = printTempData(data, 2, weatherBoolean);
    console.log(data);
    const img = document.querySelector("img");
    img.src = currentImg;
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

// async function receiveData(city) {
//     const data = await fetchWeather(city, "forecast");
//     return data;
// }

function submitData() {
    const cityInput = document.getElementById("city");
    const suggBox = document.querySelector(".autocom-box");

    document.querySelector("form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const data = await fetchWeather(cityInput.value, "forecast");
        let weatherBoolean = JSON.parse(localStorage.getItem("weatherBoolean"));
        getData(data, weatherBoolean);

        let currentCity = `${data.location.name}, ${data.location.region}, ${data.location.country}`;
        localStorage.setItem("currentCity", currentCity);
        document.querySelector("form").reset();
        suggBox.classList.add("hidden");
    });
    clickList();
}

export function runAPI() {
    const suggBox = document.querySelector(".autocom-box");
    const cityInput = document.getElementById("city");

    toggleUnits();
    submitData();
    window.addEventListener("DOMContentLoaded", async () => {
        let weatherBoolean = renderDOM();
        let currentCity = localStorage.getItem("currentCity") || "New York City";
        const data = await fetchWeather(currentCity, "forecast");
        getData(data, weatherBoolean);
        getCurrentWeather();
    });
    searchLocations();
}
