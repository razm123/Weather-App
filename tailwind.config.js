/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./dist/**/*.{html,js}", "./src/**/*.{html,js}"],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "black-rgba": "rgba(0, 0, 0, 0.54)",
                "white-rgba": "rgba(255, 255, 255, 0.54)",
            },
        },
    },
    variants: {},
    plugins: [],
};
