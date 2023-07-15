// Fetch the weather data (current or forecast, based on forecast parameter)
import { getData } from "./apiFunctions";
export async function fetchWeather(city, forecast) {
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
    } catch (err) {
        console.log("there was an error " + err);
    }
}
const fallbackLatitude = 40.7128; // Example: New York City latitude
const fallbackLongitude = -74.006; // Example: New York City longitude

// Function to fetch weather data
async function fetchWeatherLocation(latitude, longitude) {
    const apiKey = "b35580b5b878478fba522539232904";

    // API endpoint URL
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=3`;

    try {
        // Fetch weather data
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Process the weather data
        return data;
        // You can access specific weather information from the 'data' object and perform further operations
    } catch (error) {
        // Handle any errors that occur during the fetch request
        console.log("Error fetching weather data: " + error);
    }
}

// Function to handle user's location and fetch weather data
async function handleLocationAndFetchWeather(latitude, longitude) {
    if (latitude && longitude) {
        // Fetch weather data using the obtained coordinates
        let data = await fetchWeatherLocation(latitude, longitude);
        let weatherBoolean = JSON.parse(localStorage.getItem("weatherBoolean"));
        getData(data, weatherBoolean);
        let currentCity = `${data.location.name}, ${data.location.region}, ${data.location.country}`;
        document.title = currentCity.split(",")[0] + " Weather";
        localStorage.setItem("currentCity", currentCity);
        let icon = document.getElementById("favicon");
        icon.href = data.current.condition.icon;
    }
    // else {
    //     // Use the fallback location
    //     console.log("Using fallback location.");
    //     await fetchWeatherLocation(fallbackLatitude, fallbackLongitude);
    // }
}

// Function to ask for user consent using a confirm dialog
function askForLocationConsent() {
    return new Promise((resolve) => {
        const consent = confirm("This website would like to use your current location for weather information. Do you agree?");

        resolve(consent);
    });
}

// Function to get user's location and fetch weather data
// ...

// Function to get user's location and fetch weather data
// Function to get user's location and fetch weather data
async function getUserLocation() {
    if (navigator.geolocation) {
        try {
            const position = await new Promise((resolve, reject) => {
                // Retrieve the user's position
                navigator.geolocation.getCurrentPosition(resolve, reject);
                setTimeout(reject, 5000); // Reject the promise after 5 seconds if not resolved
            });

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            // Call the function to handle location and fetch weather data
            await handleLocationAndFetchWeather(latitude, longitude);
        } catch (error) {
            if (error && error.message) {
                // Error getting user's location, use the fallback location
                console.log("Error during geolocation: " + error.message);
            } else {
                console.log("Error getting user's location. Using fallback location.");
            }

            console.log("Using fallback location.");

            // Call the function to handle location and fetch weather data with fallback coordinates
            await handleLocationAndFetchWeather(null, null);
        }
    } else {
        // Geolocation is not supported, use the fallback location
        alert("Geolocation is not supported by this browser.");
        console.log("Using fallback location.");

        // Call the function to handle location and fetch weather data with fallback coordinates
        await handleLocationAndFetchWeather(null, null);
    }
}

// Function to prompt the user to enable location services on a mobile device
// function EnableLocationServices() {
//     const isAndroid = /Android/i.test(navigator.userAgent);
//     const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

//     if (isAndroid && !navigator.geolocation) {
//         alert("Please enable location services on your device to access weather information.");
//     } else if (isIOS && !navigator.geolocation) {
//         const enableLocation = confirm("Please enable location services on your device to access weather information. Enable now?");
//         if (enableLocation) {
//             window.location.href = "App-Prefs:Privacy";
//         }
//     }
// }

function EnableLocationServices() {
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isAndroid) {
        if (!navigator.geolocation) {
            alert("Please enable location services on your device to access weather information.");
        } else {
            navigator.geolocation.getCurrentPosition(
                () => {
                    // Location services are enabled
                    console.log("Location services are enabled on Android.");
                },
                (error) => {
                    // Location services are disabled or there was an error
                    alert("Please enable location services on your device to access weather information.");
                }
            );
        }
    } else if (isIOS && !navigator.geolocation) {
        const enableLocation = confirm("Please enable location services on your device to access weather information. Enable now?");
        if (enableLocation) {
            window.location.href = "App-Prefs:root=LOCATION_SERVICES"; // Open privacy settings on iOS devices
        }
    } else if (!navigator.geolocation) {
        alert("Geolocation is not supported by this browser.");
    }
}

// Attach the event listener to the button element

// Prompt the user to enable location services on mobile devices

// Attach the event listener to the button element
const button = document.getElementById("geolocationButton");
button.addEventListener("click", async () => {
    const consent = await askForLocationConsent();
    if (consent) {
        await getUserLocation();
    } else {
        alert("User disagreed to use location.");
        await handleLocationAndFetchWeather(null, null);
    }
    EnableLocationServices();
});
