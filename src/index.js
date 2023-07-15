import "./input.css";
import { runAPI } from "./API/apiFunctions";
import { setTheme } from "./DOM/darkMode";
import { clickOutsideSearch } from "./API/searchBar";
import { searchLocations } from "./API/searchBar";
runAPI();
setTheme();
clickOutsideSearch();
// searchLocations();
// On page load or when changing themes, best to add inline in `head` to avoid FOUC
