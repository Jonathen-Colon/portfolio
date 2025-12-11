/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				"terracotta": "#D96C4E",
				"mustard-yellow": "#F4C47B",
				"soft-peach": "#FADadd", 
				"off-white-paper": "#F9F7F1",
				"text-dark": "#2D3142",
				"text-light": "#6b7280",
				"border-color": "#CCC5B9",
			},
			fontFamily: {
				"sans": ["Outfit", "sans-serif"],
				"quirky": ["Fredoka", "sans-serif"]
			},
		},
	},
	plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/container-queries'),
    ],
}
