// Fetch the location to autocomplete search bar locations
import { fetchWeather } from "./weatherData";
import { getData } from "./apiFunctions";

// Function to fetch location data based on the city
export async function fetchLocation(city) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/search.json?key=b35580b5b878478fba522539232904&q=${city}`, {
            mode: "cors",
        });

        if (!response.ok) {
            throw new Error("Please enter a valid city name");
        }

        const data = await response.json();
        return data;
    } catch (err) {
        // Handle error if location is not found
        const suggBox = document.querySelector(".autocom-box");
        suggBox.classList.add("hidden");
        console.log("There was an error: " + err);
        const div = document.querySelector(".jsonDATA");
        div.textContent = "Location not found";
        throw err; // Rethrow the error to propagate it to the caller
    }
}

// Function to handle the weather when a location is selected
async function awaitWeather(e) {
    const suggBox = document.querySelector(".autocom-box");

    const cityInput = document.getElementById("city");
    cityInput.value = e.target.textContent;
    const data = await fetchWeather(cityInput.value, "forecast");
    let weatherBoolean = JSON.parse(localStorage.getItem("weatherBoolean"));
    getData(data, weatherBoolean);
    let currentCity = `${data.location.name}, ${data.location.region}, ${data.location.country}`;
    document.title = currentCity.split(",")[0] + " Weather";

    let lat = data.location.lat;
    let lon = data.location.lon;
    let latLon = `${lat} ${lon}`;
    localStorage.setItem("currentCity", currentCity);
    localStorage.setItem("latLon", latLon);
    let icon = document.getElementById("favicon");
    icon.href = data.current.condition.icon;
    document.querySelector("form").reset();
    suggBox.classList.add("hidden");
}

// Function to handle click event on the suggestion list
export function clickList() {
    const suggList = document.querySelectorAll(".autocom-box li");
    const suggBox = document.querySelector(".autocom-box");

    suggList.forEach((list) => {
        list.addEventListener("click", awaitWeather);
    });

    // Attach clickOutsideEvent listener to the window
    clickOutsideSearch();
}

// Function to render the autocomplete suggestion results
export function renderResults(results) {
    const suggBox = document.querySelector(".autocom-box");
    let cityInput = document.getElementById("city");

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
        if (cityInput.value === "") {
            // Handle empty input case if needed
        } else {
            // Handle non-empty input case if needed
        }
        return suggBox.classList.remove("hidden");
    }
}

let currentFocus;

// Function to handle click outside the search box
function clickOutsideEvent(e) {
    const suggBox = document.querySelector(".autocom-box");
    let cityInput = document.getElementById("city");

    if (!e.target.closest(".autocom-box")) {
        suggBox.classList.add("hidden");
        let listItems = document.querySelectorAll(".autocom-box li");
        removeActive(listItems);
        currentFocus = -1;
    }
    if (e.target.closest("form")) {
        if (cityInput.value != "" && cityInput.value != null && cityInput.value != "") {
            suggBox.classList.remove("hidden");
        }
    }
}

// Function to attach clickOutsideEvent listener to the window
export function clickOutsideSearch() {
    window.removeEventListener("click", clickOutsideEvent);
    window.addEventListener("click", clickOutsideEvent);
}

// Function to append suggestion list based on user input
export async function appendSuggestionList(e) {
    const cityInput = document.getElementById("city");
    const suggBox = document.querySelector(".autocom-box");
    let autocomplete;
    autocomplete = [];
    autocomplete = await fetchLocation(e.target.value);
    let locationsArray = [];

    if (autocomplete != undefined) {
        for (let i = 0; i < autocomplete.length; i++) {
            let oneRow = `${autocomplete[i].name}, ${autocomplete[i].region}, ${autocomplete[i].country}`;
            locationsArray.push(oneRow);
        }
    }

    const MAX_SUGGESTIONS = 5; // Maximum number of suggestions to display
    locationsArray = locationsArray.slice(0, MAX_SUGGESTIONS); // Limit the suggestions

    suggBox.innerHTML = "";
    renderResults(locationsArray);

    const suggList = document.querySelectorAll(".autocom-box li");

    suggList.forEach((list) => {
        list.removeEventListener("click", awaitWeather);
    });

    clickList(); // Call clickList function after appending suggestions
}

// Function to handle search input and debouncing
export function searchLocations() {
    const suggBox = document.querySelector(".autocom-box");
    const cityInput = document.getElementById("city");
    cityInput.addEventListener(
        "input",
        debounce(function (e) {
            appendSuggestionList(e);
        }, 50)
    );
    handleKeyboardNavigation();
}

// Function to debounce a given function
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

// Function to handle keyboard navigation
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
                // Down
                currentFocus++;
                addActive(listItems);
            } else if (e.code == "ArrowUp") {
                // Up
                currentFocus--;
                addActive(listItems);
            }
        }, 0)
    );
}

// Function to add "active" class to the selected list item
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

// Function to remove "active" class from list items
export function removeActive(listItems) {
    for (let i = 0; i < listItems.length; i++) {
        listItems[i].classList.remove("active");
    }
}
