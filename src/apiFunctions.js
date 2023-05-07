import { searchLocations } from "./API/searchBar";
import { clickList } from "./API/searchBar";
import { toggleUnits } from "./DOM/tempUnits";
import { renderDOM } from "./DOM/tempUnits";
import { fetchWeather } from "./API/weatherData";
import { currentWidget } from "./DOM/DOM";
import { highlights } from "./DOM/DOM";
import { dailyWidget } from "./DOM/DOM";

// function getdailyTempMin(data, currDay, weatherBoolean) {
//     let dailyTempMin;
//     if (weatherBoolean) {
//         dailyTempMin = Math.round(data.forecast.forecastday[currDay].day.mintemp_c);
//     } else {
//         dailyTempMin = Math.round(data.forecast.forecastday[currDay].day.mintemp_f);
//     }
//     return dailyTempMin;
// }

function getdailyTemp(data, currDay, weatherBoolean) {
    let dailyTempMin;
    let dailyTempMax;
    if (weatherBoolean) {
        dailyTempMin = Math.round(data.forecast.forecastday[currDay].day.mintemp_c);
        dailyTempMax = Math.round(data.forecast.forecastday[currDay].day.maxtemp_c);
    } else {
        dailyTempMin = Math.round(data.forecast.forecastday[currDay].day.mintemp_f);
        dailyTempMax = Math.round(data.forecast.forecastday[currDay].day.maxtemp_f);
    }
    return { dailyTempMin, dailyTempMax };
}
export function getData(data, weatherBoolean) {
    const div = document.querySelector(".jsonDATA");
    let currentTemp;
    let tempUnit;
    let feelslike;
    if (weatherBoolean) {
        currentTemp = Math.round(data.current.temp_c);
        feelslike = Math.round(data.current.feelslike_c);
        tempUnit = "\xB0C";
    } else {
        currentTemp = Math.round(data.current.temp_f);
        feelslike = Math.round(data.current.feelslike_f);
        tempUnit = "\xB0F";
    }
    console.log(data);
    currentWidget(data, currentTemp, tempUnit, feelslike, printCurrentDay(data, 0, "forecast"));
    for (let i = 0; i <= 2; i++) {
        let { dailyTempMin, dailyTempMax } = getdailyTemp(data, i, weatherBoolean);
        dailyWidget(data, dailyTempMin, dailyTempMax, tempUnit, printCurrentDay(data, i, "forecast"), i);
    }
    getHighlightsData(data, weatherBoolean);
}

function getHighlightsData(data, weatherBoolean) {
    const dayZeroData = data.forecast.forecastday[0];
    const humidityData = data.current.humidity;
    let lowTemp;
    let highTemp;
    let tempUnit;
    let windStatus;
    let windUnit;
    if (weatherBoolean) {
        lowTemp = Math.round(dayZeroData.day.mintemp_c);
        highTemp = Math.round(dayZeroData.day.maxtemp_c);
        tempUnit = "\xB0C";
        windStatus = data.current.wind_kph;
        windUnit = "km/h";
    } else {
        lowTemp = Math.round(dayZeroData.day.mintemp_f);
        highTemp = Math.round(dayZeroData.day.maxtemp_f);
        tempUnit = "\xB0F";
        windStatus = data.current.wind_mph;
        windUnit = "mph";
    }
    const sunrise = dayZeroData.astro.sunrise;
    const sunset = dayZeroData.astro.sunset;

    highlights(humidityData, lowTemp, highTemp, tempUnit, windStatus, windUnit, sunrise, sunset);
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
    // let getMonthDaySplit = String(getMonthDay).split("");
    let currentDate = `${getDay}`;
    document.getElementById("current-month").textContent = `${getMonth} ${getMonthDay}${nthNumber(getMonthDay)}`;
    return currentDate;
}

function updateClock() {
    let now = new Date();
    let time = now.toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit" });
    document.getElementById("current-time").textContent = time;
    setTimeout(updateClock, 60000);
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

function submitData() {
    const cityInput = document.getElementById("city");
    const suggBox = document.querySelector(".autocom-box");

    document.querySelector("form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const data = await fetchWeather(cityInput.value, "forecast");
        let weatherBoolean = JSON.parse(localStorage.getItem("weatherBoolean"));
        getData(data, weatherBoolean);

        let currentCity = `${data.location.name}, ${data.location.region}, ${data.location.country}`;
        document.title = currentCity.split(",")[0] + " Weather";

        localStorage.setItem("currentCity", currentCity);
        document.querySelector("form").reset();
        suggBox.classList.add("hidden");
    });
    clickList();
}

export function runAPI() {
    updateClock();
    const suggBox = document.querySelector(".autocom-box");
    const cityInput = document.getElementById("city");

    toggleUnits();
    submitData();
    window.addEventListener("DOMContentLoaded", async () => {
        let weatherBoolean = renderDOM();
        let currentCity = localStorage.getItem("currentCity") || "New York City";
        const data = await fetchWeather(currentCity, "forecast");
        document.title = currentCity.split(",")[0] + " Weather";
        getData(data, weatherBoolean);
        // getCurrentWeather();
    });
    searchLocations();
}

// async function getCurrentWeather() {
//     const data = await fetchWeather("New York City", "current");
//     const size = new TextEncoder().encode(JSON.stringify(data)).length;
//     const kiloBytes = size / 1024;
//     const megaBytes = kiloBytes / 1024;
//     console.log(kiloBytes);
//     currentWeather(data);
//     console.log(data);
// }

// function currentWeather(data) {
//     const dayZero = printCurrentDay(data, 0, "current");
//     let last_updated = data.current.last_updated;
//     let temp_c = data.current.temp_c;
//     console.log(`day: ${dayZero}, last updated: ${last_updated}, temperature: ${temp_c}\xB0C`);
// }

// function printTempData(data, currentDayInt, weatherBoolean) {
//     const dayString = printCurrentDay(data, currentDayInt, "forecast");
//     let min_temp;
//     let max_temp;
//     // min_temp = data.forecast.forecastday[currentDayInt].day.mintemp_f;
//     // max_temp = data.forecast.forecastday[currentDayInt].day.maxtemp_f;
//     let tempUnit;
//     if (weatherBoolean) {
//         min_temp = Math.round(data.forecast.forecastday[currentDayInt].day.mintemp_c);
//         max_temp = Math.round(data.forecast.forecastday[currentDayInt].day.maxtemp_c);
//         tempUnit = "\xB0C";
//     } else {
//         min_temp = Math.round(data.forecast.forecastday[currentDayInt].day.mintemp_f);
//         max_temp = Math.round(data.forecast.forecastday[currentDayInt].day.maxtemp_f);
//         tempUnit = "\xB0F";
//     }
//     let condition = data.forecast.forecastday[currentDayInt].day.condition.text;
//     let returnData = `${dayString}, high temp: ${max_temp}${tempUnit}, low temp: ${min_temp}${tempUnit}, condition: ${condition}`;
//     return returnData;
// }
