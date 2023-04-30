import "./input.css";
import { runAPI } from "./apiFunctions";
import { setTheme } from "./darkMode";
runAPI();
setTheme();
// On page load or when changing themes, best to add inline in `head` to avoid FOUC
