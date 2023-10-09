import { getData } from "../API/apiFunctions";
import { fetchWeather } from "../API/weatherData";

// async function fetchDataAndToggleUnits() {
//     const cityName = document.querySelector(".cityName");
//     try {
//         const data = await fetchWeather(cityName.textContent, "forecast");
//         return data;
//     } catch (error) {
//         console.error("Error fetching weather data: ", error);
//         throw error; // Re-throw the error to handle it in the calling function
//     }
// }

// // export function toggleUnits() {
// //     let weatherBoolean = JSON.parse(localStorage.getItem("weatherBoolean")) || false;
// //     localStorage.setItem("weatherBoolean", weatherBoolean);

// //     const weatherInput = document.getElementById("weatherUnits");
// //     weatherInput.addEventListener("click", async () => {
// //         const cityName = document.querySelector(".cityName");
// //         const data = await fetchWeather(cityName.textContent, "forecast");

// //         if (weatherInput.checked) {
// //             weatherBoolean = true;
// //             localStorage.setItem("weatherBoolean", weatherBoolean);
// //             getData(data, weatherBoolean);
// //         } else {
// //             weatherBoolean = false;
// //             localStorage.setItem("weatherBoolean", weatherBoolean);
// //             getData(data, weatherBoolean);
// //         }
// //     });
// //     // console.log(weatherBoolean);
// //     return weatherBoolean;
// // }

// export async function toggleUnits() {
//     try {
//         let weatherBoolean = JSON.parse(localStorage.getItem("weatherBoolean")) || false;
//         localStorage.setItem("weatherBoolean", weatherBoolean);

//         const weatherInput = document.getElementById("weatherUnits");
//         weatherInput.addEventListener("click", async () => {
//             try {
//                 const cityName = document.querySelector(".cityName");
//                 const data = await fetchWeather(cityName.textContent, "forecast");

//                 if (weatherInput.checked) {
//                     weatherBoolean = true;
//                     localStorage.setItem("weatherBoolean", weatherBoolean);
//                     getData(data, weatherBoolean);
//                 } else {
//                     weatherBoolean = false;
//                     localStorage.setItem("weatherBoolean", weatherBoolean);
//                     getData(data, weatherBoolean);
//                 }
//             } catch (error) {
//                 console.error("Error fetching weather data: ", error);
//                 // Handle error (e.g., display an error message to the user)
//             }
//         });

//         return weatherBoolean;
//     } catch (error) {
//         console.error("Error toggling units: ", error);
//         // Handle error (e.g., display an error message to the user)
//         throw error; // Re-throw the error to propagate it to the caller if needed
//     }
// }

// export function renderDOM() {
//     const suggBox = document.querySelector(".autocom-box");
//     suggBox.classList.add("hidden");
//     let weatherBoolean = JSON.parse(localStorage.getItem("weatherBoolean"));
//     let weatherUnits = document.getElementById("weatherUnits");
//     weatherUnits.checked = weatherBoolean;
//     return weatherBoolean;
// }

export async function toggleUnits() {
    try {
        let weatherBoolean = JSON.parse(localStorage.getItem("weatherBoolean")) || false;

        // Retrieve the current city name or zip code from localStorage
        const storedCity = localStorage.getItem("currentCity") || "New York City";

        // Retrieve the weather input element
        const weatherInput = document.getElementById("weatherUnits");

        // Add a click event listener to the weather input element
        weatherInput.addEventListener("click", async () => {
            try {
                // Fetch weather data based on the stored city
                const data = await fetchWeather(storedCity, "forecast");

                // Update the weatherBoolean based on the input's checked status
                weatherBoolean = weatherInput.checked;

                // Update the localStorage with the new weatherBoolean value
                localStorage.setItem("weatherBoolean", weatherBoolean);

                // Call the getData function with the fetched data and weatherBoolean
                getData(data, weatherBoolean);
            } catch (error) {
                console.error("Error fetching weather data: ", error);
                // Handle error (e.g., display an error message to the user)
            }
        });

        return weatherBoolean;
    } catch (error) {
        console.error("Error toggling units: ", error);
        // Handle error (e.g., display an error message to the user)
        throw error; // Re-throw the error to propagate it to the caller if needed
    }
}

async function fetchDataAndToggleUnits(cityNameOrZip) {
    try {
        const data = await fetchWeather(cityNameOrZip, "forecast");
        console.log("API Response:", data); // Log the API response
        localStorage.setItem("zipCode", cityNameOrZip);
        return data;
    } catch (error) {
        console.error("Error fetching weather data: ", error);
        throw error; // Re-throw the error to handle it in the calling function
    }
}

export function renderDOM() {
    const suggBox = document.querySelector(".autocom-box");
    suggBox.classList.add("hidden");

    let weatherBoolean = JSON.parse(localStorage.getItem("weatherBoolean"));
    let weatherUnits = document.getElementById("weatherUnits");
    weatherUnits.checked = weatherBoolean;

    return weatherBoolean;
}
