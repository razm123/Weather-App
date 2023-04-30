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
        // getData(data);
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
        // getData(data);
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

function getData(data) {
    const div = document.querySelector(".jsonDATA");
    // div.textContent = data;
    const currentImg = data.current.condition.icon;
    const img = document.querySelector("img");
    img.src = currentImg;
    console.log(data);
    // console.log(JSON.parse(data));
    // currentWeather(data);
    printTempData(data, 0);
    printTempData(data, 1);
    printTempData(data, 2);

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
}

function currentWeather(data) {
    const dayZero = printCurrentDay(data, 0, "current");
    let last_updated = data.current.last_updated;
    let temp_c = data.current.temp_c;
    console.log(`day: ${dayZero}, last updated: ${last_updated}, temperature: ${temp_c}\xB0C`);
}

function printTempData(data, currentDayInt) {
    const dayString = printCurrentDay(data, currentDayInt, "forecast");

    let min_temp_c = data.forecast.forecastday[currentDayInt].day.mintemp_c;
    let max_temp_c = data.forecast.forecastday[currentDayInt].day.maxtemp_c;
    let condition = data.forecast.forecastday[currentDayInt].day.condition.text;
    console.log(`day: ${dayString}, high temp: ${max_temp_c}\xB0C, low temp: ${min_temp_c}\xB0C, condition: ${condition}`);
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

// function getDayPrefix(getMonthDaySplit, getDay, getMonth, getMonthDay, getYear) {
//     let currentDate;
//     if (getMonthDaySplit.length === 1) {
//         if (getMonthDaySplit[0] === 1 || getMonthDaySplit[0] === "1") {
//             currentDate = `${getDay}, ${getMonth} ${getMonthDay}st, ${getYear}`;
//         } else if (getMonthDaySplit[0] === 2 || getMonthDaySplit[0] === "2") {
//             currentDate = `${getDay}, ${getMonth} ${getMonthDay}nd, ${getYear}`;
//         } else if (getMonthDaySplit[0] === 3 || getMonthDaySplit[0] === "3") {
//             currentDate = `${getDay}, ${getMonth} ${getMonthDay}rd, ${getYear}`;
//         } else {
//             currentDate = `${getDay}, ${getMonth} ${getMonthDay}th, ${getYear}`;
//         }
//     } else {
//         if (getMonthDaySplit[1] === 1 || getMonthDaySplit[1] === "1") {
//             currentDate = `${getDay}, ${getMonth} ${getMonthDay}st, ${getYear}`;
//         } else if (getMonthDaySplit[1] === 2 || getMonthDaySplit[1] === "2") {
//             currentDate = `${getDay}, ${getMonth} ${getMonthDay}nd, ${getYear}`;
//         } else if (getMonthDaySplit[1] === 3 || getMonthDaySplit[1] === "3") {
//             currentDate = `${getDay}, ${getMonth} ${getMonthDay}rd, ${getYear}`;
//         } else {
//             currentDate = `${getDay}, ${getMonth} ${getMonthDay}th, ${getYear}`;
//         }
//     }
//     return currentDate;
// }

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

// function toggleUnits() {
//     let weatherBolean = false;
//     const weatherInput = document.getElementById("weatherUnits");
//     if (weatherInput.checked) {
//         weatherBolean = true;
//     } else {
//         weatherBolean = false;
//     }
//     console.log(weatherBolean);
// }

async function receiveData(city) {
    const data = await fetchWeather(city, "forecast");
    return data;
}

function submitData() {
    const cityInput = document.getElementById("city");
    const suggBox = document.querySelector(".autocom-box");

    document.querySelector("form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const data = await fetchWeather(cityInput.value, "forecast");
        getData(data);
        document.querySelector("form").reset();
        suggBox.classList.add("hidden");
    });
    clickList();
}

export function runAPI() {
    const cityInput = document.getElementById("city");
    const searchWrapper = document.getElementById("search-wrapper");
    const suggBox = document.querySelector(".autocom-box");

    submitData();
    // document.querySelector(.)
    window.addEventListener("DOMContentLoaded", async () => {
        const data = await fetchWeather("new york city", "forecast");
        getData(data);
        getCurrentWeather();
        suggBox.classList.add("hidden");
    });

    cityInput.addEventListener("keyup", async (e) => {
        const autocomplete = await fetchLocation(e.target.value);
        console.log(autocomplete);
        let locationsArray = [];
        if (cityInput.value.length) {
            // suggBox.classList.remove("hidden");
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

function clickList() {
    const suggList = document.querySelectorAll(".autocom-box li");
    const suggBox = document.querySelector(".autocom-box");

    suggList.forEach((list) => {
        list.addEventListener("click", async (e) => {
            const cityInput = document.getElementById("city");
            cityInput.value = e.target.textContent;
            const data = await fetchWeather(cityInput.value, "forecast");
            getData(data);
            document.querySelector("form").reset();
            suggBox.classList.add("hidden");
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
