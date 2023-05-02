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

export function searchLocations() {
    const suggBox = document.querySelector(".autocom-box");
    const cityInput = document.getElementById("city");

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
        }
    });
}
