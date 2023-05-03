// Fetch the location to autocomplete search bar locations
import { fetchWeather } from "./weatherData";
import { getData } from "../apiFunctions";
export async function fetchLocation(city) {
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
    }
}

export function clickList() {
    const suggList = document.querySelectorAll(".autocom-box li");
    const suggBox = document.querySelector(".autocom-box");
    suggList.forEach((list) => {
        list.addEventListener("click", async (e) => {
            const cityInput = document.getElementById("city");
            cityInput.value = e.target.textContent;
            const data = await fetchWeather(cityInput.value, "forecast");
            let weatherBoolean = JSON.parse(localStorage.getItem("weatherBoolean"));
            getData(data, weatherBoolean);
            let currentCity = `${data.location.name}, ${data.location.region}, ${data.location.country}`;
            localStorage.setItem("currentCity", currentCity);

            document.querySelector("form").reset();
            suggBox.classList.add("hidden");
            // weatherInput.checked = false;
        });
    });
}

export function renderResults(results) {
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
let currentFocus;

export function searchLocations() {
    const suggBox = document.querySelector(".autocom-box");
    const cityInput = document.getElementById("city");
    cityInput.addEventListener("input", async (e) => {
        const autocomplete = await fetchLocation(e.target.value);
        console.log(autocomplete);
        let locationsArray = [];
        currentFocus = -1;
        if (cityInput.value.length) {
            for (let i = 0; i < autocomplete.length; i++) {
                let oneRow = `${autocomplete[i].name}, ${autocomplete[i].region}, ${autocomplete[i].country}`;
                locationsArray.push(oneRow);
            }
            suggBox.innerHTML = "";
            renderResults(locationsArray);
            clickList();
        }
    });
    handleKeyboardNavigation();
}

function handleKeyboardNavigation() {
    const cityInput = document.getElementById("city");

    cityInput.addEventListener("keydown", (e) => {
        let suggBox = document.querySelector(".autocom-box");
        let listItems;
        if (suggBox) {
            listItems = document.querySelectorAll(".autocom-box li");
        }
        if (e.code == "ArrowDown") {
            currentFocus++;
            addActive(listItems);
            console.log(listItems);
            // Up
        } else if (e.code == "ArrowUp") {
            currentFocus--;
            console.log(listItems);

            addActive(listItems);
        } else if (e.code == "Enter") {
            if (currentFocus > -1) {
                if (suggBox) listItems[currentFocus].click();
            }
        }
    });
}

function addActive(suggBox) {
    if (!suggBox) return false;

    removeActive(suggBox);
    if (currentFocus >= suggBox.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = suggBox.length - 1;

    suggBox[currentFocus].classList.add("active");
    console.log(suggBox);
}

function removeActive(suggBox) {
    for (let i = 0; i < suggBox.length; i++) {
        suggBox[i].classList.remove("active");
    }
}
