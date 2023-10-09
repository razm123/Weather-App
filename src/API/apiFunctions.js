// Importing modules
import { searchLocations } from "./searchBar";
import { clickList } from "./searchBar";
import { toggleUnits } from "../DOM/tempUnits";
import { renderDOM } from "../DOM/tempUnits";
import { fetchWeather } from "./weatherData";
import { currentWidget } from "../DOM/DOM";
import { highlights } from "../DOM/DOM";
import { dailyWidget } from "../DOM/DOM";
import { displayHourlyData } from "./getHourlyData";
import { getHourlyData } from "./getHourlyData";

// Function to get daily temperature
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

// Main function to get weather data
export function getData(data, weatherBoolean) {
    // Variable declarations
    const div = document.querySelector(".jsonDATA");
    let currentTemp;
    let tempUnit;
    let feelslike;

    // Conditionally set temperature units and values
    if (weatherBoolean) {
        currentTemp = Math.round(data.current.temp_c);
        feelslike = Math.round(data.current.feelslike_c);
        tempUnit = "\xB0C";
    } else {
        currentTemp = Math.round(data.current.temp_f);
        feelslike = Math.round(data.current.feelslike_f);
        tempUnit = "\xB0F";
    }

    // Fetch and display hourly data for the current day
    const hourlyData_zero = getHourlyData(data, weatherBoolean, 0);
    const day_zero = document.querySelector(`#daily-0 h2`).textContent;
    printCurrentDay(data, 0, "forecast");
    displayHourlyData(hourlyData_zero, printCurrentDay(data, 0, "forecast"), 0);

    // Get highlights data for the current day
    getHighlightsData(data, weatherBoolean, 0, "Today");

    // Loop through the next 3 days to display daily widgets and set event listeners
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

    // Set event listener for today's weather div
    const todayWeather = document.getElementById("today-weather");
    const todayHourlyData = getHourlyData(data, weatherBoolean, 0);
    todayWeather.addEventListener("click", () => {
        displayHourlyData(todayHourlyData, "Today", 0);
        getHighlightsData(data, weatherBoolean, 0, "Today");
    });

    // Display current weather widget
    currentWidget(data, currentTemp, tempUnit, feelslike, printCurrentDay(data, 0, "forecast"));
}

// Function to get highlights data for a specific day
function getHighlightsData(data, weatherBoolean, dayIndex, dayText) {
    const startingPath = data.forecast.forecastday[dayIndex];
    const humidityData = startingPath.day.avghumidity;
    let lowTemp;
    let highTemp;
    let tempUnit;
    let windStatus;
    let windUnit;

    // Conditionally set temperature units and values
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

    // Call the highlights function with the retrieved data
    highlights(humidityData, lowTemp, highTemp, tempUnit, windStatus, windUnit, sunrise, sunset, dayIndex, dayText);
}

// Function to print the current day
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
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const getDay = dayNames[dt.getUTCDay()];
    const getMonth = monthNames[dt.getUTCMonth()];
    const getMonthDay = dt.getUTCDate();
    const getYear = dt.getUTCFullYear();
    let currentDate = `${getDay}`;

    document.getElementById("current-month").textContent = `${getMonth} ${getMonthDay}${nthNumber(getMonthDay)}`;

    return currentDate;
}

// Function to update the clock
function updateClock() {
    let now = new Date();
    let time = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    document.getElementById("current-time").textContent = time;
    setTimeout(updateClock, 60000);
}

// Function to get the ordinal suffix for a number
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

// Function to submit the form data and fetch weather information
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
        let lat = data.location.lat;
        let lon = data.location.lon;
        let latLon = `${lat} ${lon}`;
        localStorage.setItem("currentCity", currentCity);
        localStorage.setItem("latLon", latLon);
        document.querySelector("form").reset();
        suggBox.classList.add("hidden");
    });

    clickList();
}

// Function to refresh data based on selected interval
function refreshData() {
    // Add implementation for refreshing data
}

// Function to run the weather application
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
        icon.href = data.current.condition.icon;

        getData(data, weatherBoolean);

        const currentTest = await fetchWeather(currentCity, "current");
    });

    searchLocations();
}

// if (navigator.geolocation) {
//     // Geolocation is supported
//     navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
// } else {
//     // Geolocation is not supported
//     console.log("Geolocation is not supported by this browser.");
// }

// function successCallback(position) {
//     // Retrieve the latitude and longitude from the position object
//     const latitude = position.coords.latitude;
//     const longitude = position.coords.longitude;

//     // Use the latitude and longitude values
//     console.log("Latitude: " + latitude);
//     console.log("Longitude: " + longitude);
// }

// function errorCallback(error) {
//     // Handle any errors that occur while retrieving the user's location
//     console.log("Error during geolocation: " + error.message);
// }
