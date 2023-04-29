// function fetchWeather(city, days) {
//     fetch(`https://api.weatherapi.com/v1/forecast.json?key=b35580b5b878478fba522539232904&q=${city}&days=${days}`, {
//         mode: "cors",
//     })
//         .then((resp) => {
//             if (resp.ok) {
//                 return resp.json();
//             }
//             throw new Error("Please enter a valid city name");
//         })
//         .then((data) => {
//             const div = document.querySelector(".jsonDATA");
//             div.textContent = JSON.stringify(data);
//             const currentImg = data["current"]["condition"]["icon"];
//             console.log(currentImg);
//             const img = document.querySelector("img");
//             img.src = currentImg;
//             // console.log(data);
//             const currentDay = data["forecast"]["forecastday"][0]["date"];
//             const zone = new Date().getTimezoneOffset() / 60;
//             const dt = new Date(`${currentDay} GMT-${zone}`);
//             // const date = new Date(`${data["location"]["forecast"]["forecastday"][0]}`);
//             console.log(data);
//             console.log(dt);
//         })
//         .catch((err) => {
//             console.log("there was an error " + err);
//             const div = document.querySelector(".jsonDATA");
//             div.textContent = "Location not found";
//         });
// }

async function fetchWeather(city, days) {
    try {
        let data;
        let response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=b35580b5b878478fba522539232904&q=${city}&days=${days}`, {
            mode: "cors",
        });
        if (response.ok) {
            data = await response.json();
        } else {
            throw new Error("Please enter a valid city name");
        }
        console.log(data);
        const div = document.querySelector(".jsonDATA");
        div.textContent = JSON.stringify(data);
        const currentImg = data["current"]["condition"]["icon"];
        console.log(currentImg);
        const img = document.querySelector("img");
        img.src = currentImg;
        // console.log(data);
        const currentDay = data["forecast"]["forecastday"][0]["date"];
        const zone = new Date().getTimezoneOffset() / 60;
        const dt = new Date(`${currentDay} GMT-${zone}`);
        // const date = new Date(`${data["location"]["forecast"]["forecastday"][0]}`);
        console.log(data);
        console.log(dt);
    } catch (err) {
        console.log("there was an error " + err);
        const div = document.querySelector(".jsonDATA");
        div.textContent = "Location not found";
        const img = document.querySelector("img");
        img.src = "";
    }
}

// const { zonedTimeToUtc, utcToZonedTime, format } = require("date-fns-tz");
// import zonedTimeToUtc from "date-fns";

const cityInput = document.getElementById("city");
document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    fetchWeather(cityInput.value, 3);
    document.querySelector("form").reset();
});

window.addEventListener("DOMContentLoaded", () => {
    fetchWeather("new york city", 3);
});

// async function fetchWeather2(city) {
//     let lat;
//     let lon;
//     try {
//         const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&APPID=a2f8a3096070fae9f0470e819115b92d`, {
//             mode: "cors",
//         });
//         const result = await response.json();
//         console.log(result);
//         lat = result;
//     } catch (e) {
//         console.log("Error:", e);
//     }
// }

// fetchWeather2("willow grove");
