/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./dist/**/*.{html,js}", "./src/**/*.{html,js}"],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "black-rgba": "rgba(0, 0, 0, 0.54)",
                "black-rgba2": "rgba(0, 0, 0, 0.4)",
            },
        },
    },
    variants: {},
    plugins: [],
};
