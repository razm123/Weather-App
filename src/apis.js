async function fetchWeather(city) {
    try {
        let data;
        let response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=b35580b5b878478fba522539232904&q=${city}&days=3`, {
            mode: "cors",
        });
        if (response.ok) {
            data = await response.json();
        } else {
            throw new Error("Please enter a valid city name");
        }
        getData(data);
    } catch (err) {
        console.log("there was an error " + err);
        const div = document.querySelector(".jsonDATA");
        div.textContent = "Location not found";
        // const img = document.querySelector("img");
        // img.src = "";
    }
}

function getData(data) {
    const div = document.querySelector(".jsonDATA");
    div.textContent = JSON.stringify(data);
    const currentImg = data["current"]["condition"]["icon"];
    const img = document.querySelector("img");
    img.src = currentImg;
    console.log(data);
    const currentDay = data["forecast"]["forecastday"][0]["date"];
    const dayZero = printCurrentDay(data, 0);
    let last_updated = data["current"]["last_updated"];
    let temp_c = data["current"]["temp_c"];
    console.log(`day: ${dayZero}, last updated: ${last_updated}, temperature: ${temp_c}\xB0C`);
    // const date = new Date(`${data["location"]["forecast"]["forecastday"][0]}`);
    // console.log(data)
    // console.log(dt);
}

function printCurrentDay(data, day) {
    const currentDay = data["forecast"]["forecastday"][day]["date"];

    console.log(currentDay);
    const zone = new Date().getTimezoneOffset() / 60;
    const dt = new Date(`${currentDay} GMT-${zone}`);
    const dayInt = dt.getDay();
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    // console.log(dayNames[dayInt]);
    return dayNames[dayInt];
}

// const { zonedTimeToUtc, utcToZonedTime, format } = require("date-fns-tz");
// import zonedTimeToUtc from "date-fns";

export function runAPI() {
    const cityInput = document.getElementById("city");
    document.querySelector("form").addEventListener("submit", (e) => {
        e.preventDefault();
        fetchWeather(cityInput.value);
        document.querySelector("form").reset();
    });

    window.addEventListener("DOMContentLoaded", () => {
        fetchWeather("new york city");
    });
}
