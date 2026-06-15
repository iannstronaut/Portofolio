/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,jsx}"],
	theme: {
		extend: {
			colors: {
				ink: "#1d1d1f",
				action: "#0066cc",
			},
			fontFamily: {
				sans: [
					"Inter",
					"system-ui",
					"-apple-system",
					"BlinkMacSystemFont",
					"SF Pro Text",
					"sans-serif",
				],
				mono: [
					"JetBrains Mono",
					"ui-monospace",
					"SFMono-Regular",
					"Menlo",
					"monospace",
				],
			},
		},
	},
	plugins: [],
}
