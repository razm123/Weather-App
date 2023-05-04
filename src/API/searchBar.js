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

async function awaitWeather(e) {
    const suggBox = document.querySelector(".autocom-box");

    const cityInput = document.getElementById("city");
    cityInput.value = e.target.textContent;
    const data = await fetchWeather(cityInput.value, "forecast");
    let weatherBoolean = JSON.parse(localStorage.getItem("weatherBoolean"));
    getData(data, weatherBoolean);
    let currentCity = `${data.location.name}, ${data.location.region}, ${data.location.country}`;
    localStorage.setItem("currentCity", currentCity);

    document.querySelector("form").reset();
    suggBox.classList.add("hidden");
}

export function clickList() {
    const suggList = document.querySelectorAll(".autocom-box li");
    const suggBox = document.querySelector(".autocom-box");
    suggList.forEach((list) => {
        list.addEventListener("click", awaitWeather);
    });
    // hideOnOutsideClick();
    const searchInput = document.querySelector("form");
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

function clickOutsideEvent(e) {
    const suggBox = document.querySelector(".autocom-box");
    if (!e.target.closest(".autocom-box")) {
        suggBox.classList.add("hidden");
        let listItems = document.querySelectorAll(".autocom-box li");
        removeActive(listItems);
        currentFocus = -1;
    }
    // if (e.target.closest("form")) {
    //     console.log("test");
    //     suggBox.classList.remove("hidden");
    // }
}

export function clickOutsideSearch() {
    window.removeEventListener("click", clickOutsideEvent);
    window.addEventListener("click", clickOutsideEvent);
}

export async function appendSuggestionList(e) {
    const cityInput = document.getElementById("city");
    const suggBox = document.querySelector(".autocom-box");
    let autocomplete;
    autocomplete = [];
    autocomplete = await fetchLocation(e.target.value);
    let locationsArray = [];
    currentFocus = -1;
    if (cityInput.value.length) {
        for (let i = 0; i < autocomplete.length; i++) {
            let oneRow = `${autocomplete[i].name}, ${autocomplete[i].region}, ${autocomplete[i].country}`;
            locationsArray.push(oneRow);
        }

        suggBox.innerHTML = "";
        renderResults(locationsArray);
        const suggList = document.querySelectorAll(".autocom-box li");

        suggList.forEach((list) => {
            list.removeEventListener("click", awaitWeather);
        });
        clickList();
        locationsArray = [];
        autocomplete = [];
    }
}

export function searchLocations() {
    const suggBox = document.querySelector(".autocom-box");
    const cityInput = document.getElementById("city");
    cityInput.addEventListener(
        "input",
        debounce(function (e) {
            appendSuggestionList(e);
        }, 0)
    );
    handleKeyboardNavigation();
}

function debounce(func, wait, immediate) {
    let timeout;
    return function () {
        let context = this,
            args = arguments;
        let later = function () {
            timeout = null;
            if (!immediate) {
                func.apply(context, args);
            }
        };
        let callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) {
            func.apply(context, args);
        }
    };
}

// Function to add keyboard navigation to the search bar
function handleKeyboardNavigation() {
    const cityInput = document.getElementById("city");

    cityInput.addEventListener(
        "keydown",
        debounce(function (e) {
            let suggBox = document.querySelector(".autocom-box");
            let listItems;
            if (suggBox) {
                listItems = document.querySelectorAll(".autocom-box li");
            }
            if (e.code == "ArrowDown") {
                currentFocus++;
                addActive(listItems);
                // Up
            } else if (e.code == "ArrowUp") {
                currentFocus--;

                addActive(listItems);
            } else if (e.code == "Enter") {
                if (currentFocus > -1) {
                    e.preventDefault();
                    // let currentList = addActive(listItems);
                    if (suggBox) list[currentFocus].click();
                }
            }
        }, 0)
    );
}

function addActive(listItems) {
    if (!listItems) return false;

    removeActive(listItems);
    if (currentFocus >= listItems.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = listItems.length - 1;
    console.log(listItems[currentFocus]);
    listItems[currentFocus].classList.add("active");
    let city = document.getElementById("city");
    console.log(city);
    city.value = listItems[currentFocus].textContent;
}

export function removeActive(listItems) {
    for (let i = 0; i < listItems.length; i++) {
        listItems[i].classList.remove("active");
    }
}
