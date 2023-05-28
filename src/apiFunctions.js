import { searchLocations } from "./API/searchBar";
import { clickList } from "./API/searchBar";
import { toggleUnits } from "./DOM/tempUnits";
import { renderDOM } from "./DOM/tempUnits";
import { fetchWeather } from "./API/weatherData";
import { currentWidget } from "./DOM/DOM";
import { highlights } from "./DOM/DOM";
import { dailyWidget } from "./DOM/DOM";
import { displayHourlyData } from "./API/getHourlyData";

import { getHourlyData } from "./API/getHourlyData";

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
// export function getData(data, weatherBoolean) {
//     const div = document.querySelector(".jsonDATA");
//     let currentTemp;
//     let tempUnit;
//     let feelslike;
//     if (weatherBoolean) {
//         currentTemp = Math.round(data.current.temp_c);
//         feelslike = Math.round(data.current.feelslike_c);
//         tempUnit = "\xB0C";
//     } else {
//         currentTemp = Math.round(data.current.temp_f);
//         feelslike = Math.round(data.current.feelslike_f);
//         tempUnit = "\xB0F";
//     }
//     for (let i = 0; i <= 2; i++) {
//         let { dailyTempMin, dailyTempMax } = getdailyTemp(data, i, weatherBoolean);
//         dailyWidget(data, dailyTempMin, dailyTempMax, tempUnit, printCurrentDay(data, i, "forecast"), i);
//         getHourlyData(data, weatherBoolean, i);
//     }
//     currentWidget(data, currentTemp, tempUnit, feelslike, printCurrentDay(data, 0, "forecast"));

//     getHighlightsData(data, weatherBoolean);
// }

// export function getData(data, weatherBoolean) {
//     const div = document.querySelector(".jsonDATA");
//     let currentTemp;
//     let tempUnit;
//     let feelslike;
//     if (weatherBoolean) {
//         currentTemp = Math.round(data.current.temp_c);
//         feelslike = Math.round(data.current.feelslike_c);
//         tempUnit = "\xB0C";
//     } else {
//         currentTemp = Math.round(data.current.temp_f);
//         feelslike = Math.round(data.current.feelslike_f);
//         tempUnit = "\xB0F";
//     }
//     for (let i = 0; i <= 2; i++) {
//         let { dailyTempMin, dailyTempMax } = getdailyTemp(data, i, weatherBoolean);
//         dailyWidget(data, dailyTempMin, dailyTempMax, tempUnit, printCurrentDay(data, i, "forecast"), i);
//         getHourlyData(data, weatherBoolean, i);
//         // Call the function to update the carousel with the hourly data
//         // updateCarousel(hourlyData, i);
//     }
//     let hourlyData = getHourlyData(data, weatherBoolean, 1);

//     updateCarousel(hourlyData, 1);

//     currentWidget(data, currentTemp, tempUnit, feelslike, printCurrentDay(data, 0, "forecast"));

//     getHighlightsData(data, weatherBoolean);
// }

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
    const hourlyData_zero = getHourlyData(data, weatherBoolean, 0);
    const day_zero = document.querySelector(`#daily-0 h2`).textContent;
    printCurrentDay(data, 0, "forecast");
    displayHourlyData(hourlyData_zero, printCurrentDay(data, 0, "forecast"), 0);
    getHighlightsData(data, weatherBoolean, 0, "Today");
    for (let i = 0; i <= 2; i++) {
        let { dailyTempMin, dailyTempMax } = getdailyTemp(data, i, weatherBoolean);
        dailyWidget(data, dailyTempMin, dailyTempMax, tempUnit, printCurrentDay(data, i, "forecast"), i);
        const hourlyData = getHourlyData(data, weatherBoolean, i);
        const dailyDiv = document.getElementById(`daily-${i}`);
        const currentDay = document.querySelector(`#daily-${i} h2`).textContent;
        const dailyDivHeading = document.querySelector(`#daily-${i} h2`);
        // Add event listener to each daily div
        dailyDiv.addEventListener("click", (event) => {
            event.stopPropagation(); // Prevent click event from bubbling up to parent elements
            displayHourlyData(hourlyData, currentDay, i);
            getHighlightsData(data, weatherBoolean, i, dailyDivHeading.textContent);
        });
    }
    const todayWeather = document.getElementById("today-weather");
    const todayHourlyData = getHourlyData(data, weatherBoolean, 0);

    todayWeather.addEventListener("click", () => {
        displayHourlyData(todayHourlyData, "Today", 0);
        getHighlightsData(data, weatherBoolean, 0, "Today");
    });
    currentWidget(data, currentTemp, tempUnit, feelslike, printCurrentDay(data, 0, "forecast"));
}

// function updateCarousel(hourlyData, carouselIndex) {
//     const carouselContainer = document.querySelector(".carousel-container");
//     const carousel = document.querySelector(".carousel");

//     // Create a weather data div
//     const weatherDataDiv = document.createElement("div");
//     weatherDataDiv.classList.add("weather-data");

//     // Apply CSS styles for horizontal layout
//     weatherDataDiv.style.display = "flex";
//     weatherDataDiv.style.flexDirection = "row";
//     weatherDataDiv.style.alignItems = "center";

//     // Check if the carouselIndex matches the current day index
//     const currentDayIndex = new Date().getDay(); // Assuming Sunday is the first day (index 0)
//     if (carouselIndex === currentDayIndex) {
//         // Populate the weather data div with the hourly temperature and time for the current day
//         for (let i = 0; i < hourlyData.temp.length; i++) {
//             const hourlyTemp = hourlyData.temp[i];
//             const hourlyTime = hourlyData.time[i];

//             // Create a div to hold each temperature and time
//             const dataItemDiv = document.createElement("div");
//             dataItemDiv.classList.add("weather-data-item");

//             // Create a paragraph element for each temperature and time
//             const tempParagraph = document.createElement("p");
//             tempParagraph.textContent = hourlyTemp;
//             const timeParagraph = document.createElement("p");
//             timeParagraph.textContent = hourlyTime;

//             // Append the temperature and time paragraphs to the data item div
//             dataItemDiv.appendChild(tempParagraph);
//             dataItemDiv.appendChild(timeParagraph);

//             // Append the data item div to the weather data div
//             weatherDataDiv.appendChild(dataItemDiv);
//         }
//     }

//     // Append the weather data div to the carousel
//     carousel.appendChild(weatherDataDiv);
// }

function getHighlightsData(data, weatherBoolean, dayIndex, dayText) {
    const startingPath = data.forecast.forecastday[dayIndex];
    const humidityData = startingPath.day.avghumidity;
    let lowTemp;
    let highTemp;
    let tempUnit;
    let windStatus;
    let windUnit;
    if (weatherBoolean) {
        lowTemp = Math.round(startingPath.day.mintemp_c);
        highTemp = Math.round(startingPath.day.maxtemp_c);
        tempUnit = "\xB0C";
        windStatus = startingPath.day.maxwind_kph;
        windUnit = "km/h";
    } else {
        lowTemp = Math.round(startingPath.day.mintemp_f);
        highTemp = Math.round(startingPath.day.maxtemp_f);
        tempUnit = "\xB0F";
        windStatus = startingPath.day.maxwind_mph;
        windUnit = "mph";
    }
    const sunrise = startingPath.astro.sunrise;
    const sunset = startingPath.astro.sunset;

    highlights(humidityData, lowTemp, highTemp, tempUnit, windStatus, windUnit, sunrise, sunset, dayIndex, dayText);
}

// function printCurrentDay(data, currentDayInt, forecastType) {
//     let currentDay;
//     if (forecastType === "forecast") {
//         currentDay = data.forecast.forecastday[currentDayInt].date;
//     } else {
//         currentDay = new Date();
//     }
//     const zone = new Date().getTimezoneOffset() / 60;
//     const dt = new Date(`${currentDay} GMT-${zone}`);
//     const dayInt = dt.getDay();
//     const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//     const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "December"];
//     const getDay = dayNames[dt.getDay()];
//     const getMonth = monthNames[dt.getMonth()];
//     const getMonthDay = dt.getDate();
//     const getYear = dt.getFullYear();
//     // let getMonthDaySplit = String(getMonthDay).split("");
//     let currentDate = `${getDay}`;
//     document.getElementById("current-month").textContent = `${getMonth} ${getMonthDay}${nthNumber(getMonthDay)}`;
//     return currentDate;
// }
// function printCurrentDay(data, currentDayInt, forecastType) {
//     let currentDay;
//     if (forecastType === "forecast") {
//         currentDay = data.forecast.forecastday[currentDayInt].date;
//     } else {
//         currentDay = new Date();
//     }
//     const zone = new Date().getTimezoneOffset() / 60;
//     const dt = new Date(`${currentDay} GMT-${zone}`);
//     const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//     const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
//     const getDay = dayNames[dt.getDay()];
//     const getMonth = monthNames[dt.getMonth()];
//     const getMonthDay = dt.getDate();
//     const getYear = dt.getFullYear();
//     let currentDate = `${getDay}`;
//     document.getElementById("current-month").textContent = `${getMonth}-${getMonthDay}${nthNumber(getMonthDay)}`;
//     return currentDate;
// }

function printCurrentDay(data, currentDayInt, forecastType) {
    let currentDay;
    if (forecastType === "forecast") {
        currentDay = data.forecast.forecastday[currentDayInt].date;
    } else {
        currentDay = new Date().toISOString().slice(0, 10);
    }
    const dt = new Date(currentDay);
    const dayInt = dt.getUTCDay();
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const getDay = dayNames[dt.getUTCDay()];
    const getMonth = monthNames[dt.getUTCMonth()];
    const getMonthDay = dt.getUTCDate();
    const getYear = dt.getUTCFullYear();
    let currentDate = `${getDay}`;
    document.getElementById("current-month").textContent = `${getMonth} ${getMonthDay}${nthNumber(getMonthDay)}`;
    return currentDate;
}

function updateClock() {
    let now = new Date();
    let time = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    document.getElementById("current-time").textContent = time;
    setTimeout(updateClock, 60000);
}

export const nthNumber = (number) => {
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
        let icon = document.getElementById("favicon");
        icon.href = data.current.condition.icon;

        localStorage.setItem("currentCity", currentCity);
        document.querySelector("form").reset();
        suggBox.classList.add("hidden");
    });
    clickList();
}

// Function to refresh data based on selected interval
function refreshData() {}

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
        let icon = document.getElementById("favicon");
        console.log(data);
        icon.href = data.current.condition.icon;

        getData(data, weatherBoolean);
        const currentTest = await fetchWeather(currentCity, "current");
        // getCurrentWeather();
    });
    searchLocations();
}

// async function getCurrentWeather() {
//     const data = await fetchWeather("New York City", "current");
//     const size = new TextEncoder().encode(JSON.stringify(data)).length;
//     const kiloBytes = size / 1024;
//     const megaBytes = kiloBytes / 1024;
//     currentWeather(data);
// }

// function currentWeather(data) {
//     const dayZero = printCurrentDay(data, 0, "current");
//     let last_updated = data.current.last_updated;
//     let temp_c = data.current.temp_c;
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
