import "./input.css";
import { runAPI } from "./apiFunctions";
import { setTheme } from "./darkMode";
import { clickOutsideSearch } from "./API/searchBar";
import { searchLocations } from "./API/searchBar";
runAPI();
setTheme();
clickOutsideSearch();
// searchLocations();
// On page load or when changing themes, best to add inline in `head` to avoid FOUC
