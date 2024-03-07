/** @type {import('tailwindcss').Config} */
export default {
    plugins: [],
    theme: {
        extend: {
            inset: {
                '-1': '-1rem',
            }
        },
    },
    content: ['./src/**/*.{html,js,svelte,ts}'],
    variants: {
        extend: {},
    },
    darkmode: false, // or 'media' or 'class'
}