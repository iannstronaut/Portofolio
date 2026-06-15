import React, { useState, useEffect, useRef, createContext, useContext } from "react"

/* ============================================================
   Content loading
   - Vite/production: fetched from /content.json at runtime, so the site
     can be re-edited without rebuilding or redeploying.
   - Standalone preview.html: reads window.__CONTENT__ (inlined), because
     file:// cannot fetch local JSON.
   ============================================================ */
const ContentCtx = createContext(null)
const useApp = () => useContext(ContentCtx)
const useContent = () => useContext(ContentCtx).content
const useUi = () => useContext(ContentCtx).ui

function useLoadedContent() {
	const [data, setData] = useState(
		typeof window !== "undefined" && window.__CONTENT__ ? window.__CONTENT__ : null,
	)
	const [error, setError] = useState(false)
	useEffect(() => {
		if (data) return
		let alive = true
		fetch("content.json", { cache: "no-store" })
			.then((r) => {
				if (!r.ok) throw new Error("load failed")
				return r.json()
			})
			.then((d) => alive && setData(d))
			.catch(() => alive && setError(true))
		return () => {
			alive = false
		}
	}, [])
	return { data, error }
}

function useClock() {
	const fmt = () =>
		new Date().toLocaleTimeString("en-GB", {
			timeZone: "Asia/Jakarta",
			hour: "2-digit",
			minute: "2-digit",
		})
	const [t, setT] = useState(fmt())
	useEffect(() => {
		const id = setInterval(() => setT(fmt()), 15000)
		return () => clearInterval(id)
	}, [])
	return t
}

/* ============================================================
   Inline UI icons (thin stroke)
   ============================================================ */
const ICONS = {
	back: ["M15 18l-6-6 6-6"],
	forward: ["M9 18l6-6-6-6"],
	refresh: ["M3 12a9 9 0 1 0 2.6-6.3M3 4.5V9h4.5"],
	lock: ["M6 11h12v9H6z", "M9 11V8a3 3 0 0 1 6 0v3"],
	share: ["M12 15V4", "M8 8l4-4 4 4", "M5 13v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"],
	plus: ["M12 5v14M5 12h14"],
	arrow: ["M5 12h14M13 6l6 6-6 6"],
	mail: ["M3 6h18v12H3z", "M3 7l9 6 9-6"],
}
function Ico({ name, className = "h-4 w-4" }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
			{(ICONS[name] || []).map((d, i) => (
				<path key={i} d={d} />
			))}
		</svg>
	)
}

/* ============================================================
   macOS dock app icons (each renders its own rounded tile)
   ============================================================ */
const TILE = "grid h-full w-full place-items-center rounded-[12px] shadow-md ring-1 ring-black/10"

function BrowserIcon() {
	return (
		<span className={TILE + " tile-browser"}>
			<svg viewBox="0 0 24 24" fill="none" className="h-[74%] w-[74%]">
				<circle cx="12" cy="12" r="9.2" fill="rgba(255,255,255,.16)" stroke="#fff" strokeWidth="1.4" />
				<ellipse cx="12" cy="12" rx="3.7" ry="9.2" stroke="#fff" strokeWidth="1.2" />
				<line x1="2.8" y1="12" x2="21.2" y2="12" stroke="#fff" strokeWidth="1.2" />
				<path d="M5 7.4c4 1.5 10 1.5 14 0" stroke="#fff" strokeWidth="1.1" strokeLinecap="round" />
				<path d="M5 16.6c4-1.5 10-1.5 14 0" stroke="#fff" strokeWidth="1.1" strokeLinecap="round" />
			</svg>
		</span>
	)
}

function VSCodeIcon() {
	return (
		<span className={TILE + " tile-vscode"}>
			<svg viewBox="0 0 24 24" className="h-[62%] w-[62%]">
				<path fill="#ffffff" d="M23.15 2.587 18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448z" />
			</svg>
		</span>
	)
}

function DockerIcon() {
	return (
		<span className={TILE + " tile-docker"}>
			<svg viewBox="0 0 24 24" className="h-[68%] w-[68%]">
				<path
					fill="#fff"
					d="M13.983 11.078h2.119a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.119a.185.185 0 0 0-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 0 0 .186-.186V3.574a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 0 0 .186-.186V6.29a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 0 0 .184-.186V6.29a.185.185 0 0 0-.185-.185H8.1a.185.185 0 0 0-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 0 0 .185-.186V6.29a.185.185 0 0 0-.185-.185H5.136a.186.186 0 0 0-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 0 0 .184-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.185.185 0 0 0-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 0 0 .185-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.186.186 0 0 0-.186.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 0 0 .184-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.185.185 0 0 0-.184.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 0 0-.75.748 11.376 11.376 0 0 0 .692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 0 0 3.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288Z"
				/>
			</svg>
		</span>
	)
}

function FigmaIcon() {
	return (
		<span className={TILE + " bg-white"}>
			<svg viewBox="0 0 38 57" className="h-[68%]">
				<path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1abcfe" />
				<path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#0acf83" />
				<path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#ff7262" />
				<path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#f24e1e" />
				<path d="M0 28.5a9.5 9.5 0 0 0 9.5 9.5H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#a259ff" />
			</svg>
		</span>
	)
}

function ZoomIcon() {
	return (
		<span className={TILE + " tile-zoom"}>
			<svg viewBox="0 0 24 24" className="h-[52%] w-[62%]">
				<path
					fill="#fff"
					d="M5.033 14.649H.743a.74.74 0 0 1-.686-.458.74.74 0 0 1 .16-.808L3.19 10.41H1.06A1.06 1.06 0 0 1 0 9.35h3.957c.301 0 .57.18.686.458a.74.74 0 0 1-.161.808L1.51 13.59h2.464c.585 0 1.06.475 1.06 1.06zM24 11.338c0-1.14-.927-2.066-2.066-2.066-.61 0-1.158.265-1.537.686a2.061 2.061 0 0 0-1.536-.686c-1.14 0-2.066.926-2.066 2.066v3.311a1.06 1.06 0 0 0 1.06-1.06v-2.251a1.004 1.004 0 0 1 2.013 0v2.251c0 .586.474 1.06 1.06 1.06v-3.311a1.004 1.004 0 0 1 2.012 0v2.251c0 .586.475 1.06 1.06 1.06zM16.265 12a2.728 2.728 0 1 1-5.457 0 2.728 2.728 0 0 1 5.457 0zm-1.06 0a1.669 1.669 0 1 0-3.338 0 1.669 1.669 0 0 0 3.338 0zm-4.82 0a2.728 2.728 0 1 1-5.458 0 2.728 2.728 0 0 1 5.457 0zm-1.06 0a1.669 1.669 0 1 0-3.338 0 1.669 1.669 0 0 0 3.338 0z"
				/>
			</svg>
		</span>
	)
}

const DOCK_APPS = [
	{ key: "figma", label: "Figma", Icon: FigmaIcon },
	{ key: "vscode", label: "Visual Studio Code", Icon: VSCodeIcon },
	{ key: "browser", label: "Browser", Icon: BrowserIcon, launcher: true },
	{ key: "docker", label: "Docker Desktop", Icon: DockerIcon },
	{ key: "zoom", label: "Zoom", Icon: ZoomIcon },
]

function Dock({ down, bounceSafari, booted, onLaunch, onHover }) {
	return (
		<div
			className={"dock-wrap " + (down ? "dock-down" : "")}
			onMouseEnter={() => onHover(true)}
			onMouseLeave={() => onHover(false)}
		>
			<div className="glass flex items-end gap-2 rounded-[20px] border border-white/40 px-2.5 py-1.5 shadow-2xl">
				{DOCK_APPS.map((app) => {
					const Icon = app.Icon
					const running = booted && app.launcher
					return (
						<button
							key={app.key}
							title={app.label}
							aria-label={app.label}
							onClick={() => app.launcher && onLaunch()}
							className="group relative flex flex-col items-center"
					>
							<span
								className={
									"dock-icon h-[42px] w-[42px] " +
									(bounceSafari && app.launcher ? "dock-bounce" : "")
								}
							>
								<Icon />
							</span>
							<span
								className={
									"mt-1 h-1 w-1 rounded-full bg-black/45 transition-opacity " +
									(running ? "opacity-100" : "opacity-0")
								}
							/>
						</button>
					)
				})}
			</div>
		</div>
	)
}

/* ============================================================
   Cursor + menu bar
   ============================================================ */
function MacCursor({ phase }) {
	return (
		<div className={"boot-cursor " + (phase >= 1 ? "cursor-move " : "") + (phase === 2 ? "cursor-click" : "")}>
			<svg width="22" height="22" viewBox="0 0 24 24">
				<path d="M5 3l14 8-6 1.4 3.4 6.2-2.4 1.3-3.4-6.2L5 19z" fill="#fff" stroke="#111" strokeWidth="1.1" strokeLinejoin="round" />
			</svg>
		</div>
	)
}

function MenuBar() {
	const clock = useClock()
	return (
		<div className="fixed inset-x-0 top-0 z-50 flex h-7 items-center justify-between border-b border-white/10 bg-[#0d1b2a]/85 px-4 text-[12px] text-white/90 backdrop-blur-md">
			<div className="flex items-center gap-4">
				<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
					<circle cx="12" cy="12" r="9" />
					<ellipse cx="12" cy="12" rx="3.7" ry="9" />
					<line x1="3" y1="12" x2="21" y2="12" />
				</svg>
				<span className="font-semibold">Browser</span>
				<span className="hidden opacity-80 sm:inline">File</span>
				<span className="hidden opacity-80 sm:inline">Edit</span>
				<span className="hidden opacity-80 sm:inline">View</span>
				<span className="hidden opacity-80 sm:inline">History</span>
			</div>
			<div className="flex items-center gap-3">
				<span className="hidden opacity-80 sm:inline">100%</span>
				<span className="opacity-80">Thu</span>
				<span className="tabular-nums">{clock}</span>
			</div>
		</div>
	)
}

/* ============================================================
   Reusable bits
   ============================================================ */
function Container({ children, className = "" }) {
	return <div className={"mx-auto w-full max-w-5xl px-6 sm:px-8 " + className}>{children}</div>
}

function SectionHead({ index, eyebrow, title }) {
	return (
		<div className="relative mb-8">
			<div className="watermark pointer-events-none absolute -left-1 -top-7 select-none text-[84px] font-bold sm:-top-10 sm:text-[120px]">
				{index}
			</div>
			<div className="relative">
				<div className="font-mono text-[11px] uppercase tracking-[0.22em] text-action">{eyebrow}</div>
				<h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-[28px]">{title}</h2>
			</div>
		</div>
	)
}

function Chip({ children }) {
	return (
		<span className="rounded-full bg-neutral-900/[0.045] px-2.5 py-1 text-xs font-medium text-neutral-600 ring-1 ring-neutral-900/[0.06]">
			{children}
		</span>
	)
}

/* project thumbnail: four distinct, realistic product mock layouts */
function MockChrome({ children }) {
	return (
		<div className="mini-win flex h-full flex-col">
			<div className="flex items-center gap-1.5 border-b border-black/5 bg-neutral-100/90 px-3 py-2">
				<span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
				<span className="h-2 w-2 rounded-full bg-[#febc2e]" />
				<span className="h-2 w-2 rounded-full bg-[#28c840]" />
				<div className="ml-2 h-3 flex-1 rounded bg-white/80 ring-1 ring-black/5" />
			</div>
			<div className="stage relative flex-1 overflow-hidden bg-gradient-to-br from-slate-50 to-white p-3">
				{children}
			</div>
		</div>
	)
}

function Mock({ variant }) {
	if (variant === 1) {
		// mobile app
		return (
			<div className="flex h-full items-center justify-center">
				<div className="flex h-[94%] w-[40%] flex-col gap-1.5 rounded-xl bg-white p-2 shadow ring-1 ring-black/5">
					<div className="mx-auto h-1 w-6 rounded bg-neutral-200" />
					<div className="h-9 rounded-md bg-gradient-to-br from-sky-400 to-blue-600" />
					<div className="h-2 w-3/4 rounded bg-neutral-200" />
					<div className="h-2 w-1/2 rounded bg-neutral-200" />
					<div className="mt-auto flex justify-between">
						<span className="h-3 w-3 rounded-full bg-blue-500" />
						<span className="h-3 w-3 rounded-full bg-neutral-200" />
						<span className="h-3 w-3 rounded-full bg-neutral-200" />
					</div>
				</div>
			</div>
		)
	}
	if (variant === 2) {
		// design-system swatches
		const cells = [
			"bg-blue-600", "bg-blue-400", "bg-slate-800", "bg-neutral-200",
			"bg-sky-300", "bg-neutral-300", "bg-blue-500", "bg-slate-500",
		]
		return (
			<div className="grid h-full grid-cols-4 grid-rows-2 gap-1.5">
				{cells.map((c, i) => (
					<div key={i} className={"rounded-md ring-1 ring-black/5 " + c} />
				))}
			</div>
		)
	}
	if (variant === 3) {
		// code editor (dark)
		const lines = ["w-1/3", "w-2/3", "w-1/2", "w-3/5", "w-2/5", "w-1/2"]
		const tones = ["bg-sky-400/80", "bg-emerald-400/70", "bg-neutral-500/70", "bg-blue-400/70", "bg-neutral-500/60", "bg-emerald-400/60"]
		return (
			<div className="flex h-full gap-2 rounded-lg bg-[#0f1b2a] p-2.5">
				<div className="flex flex-col items-end gap-1.5 pr-1 text-[7px] leading-none text-white/25">
					{lines.map((_, i) => (
						<span key={i}>{i + 1}</span>
					))}
				</div>
				<div className="flex flex-1 flex-col gap-1.5">
					{lines.map((w, i) => (
						<div key={i} className={"h-1.5 rounded " + w + " " + tones[i]} />
					))}
				</div>
			</div>
		)
	}
	// variant 0 — dashboard
	const bars = ["h-1/3", "h-1/2", "h-2/3", "h-2/5", "h-3/4", "h-1/2", "h-5/6"]
	return (
		<div className="flex h-full gap-2">
			<div className="hidden w-1/5 flex-col gap-1.5 sm:flex">
				<div className="h-2 rounded bg-neutral-300" />
				<div className="h-2 w-4/5 rounded bg-neutral-200" />
				<div className="h-2 w-3/5 rounded bg-neutral-200" />
				<div className="mt-auto h-2 w-2/3 rounded bg-blue-200" />
			</div>
			<div className="flex flex-1 flex-col gap-2">
				<div className="grid grid-cols-3 gap-2">
					{[0, 1, 2].map((i) => (
						<div key={i} className="rounded-md bg-white p-1.5 ring-1 ring-black/5">
							<div className="h-1.5 w-2/3 rounded bg-neutral-200" />
							<div className="mt-1 h-2 w-1/2 rounded bg-blue-500" />
						</div>
					))}
				</div>
				<div className="flex flex-1 items-end gap-1.5 rounded-md bg-white p-2 ring-1 ring-black/5">
					{bars.map((h, i) => (
						<div key={i} className={"flex-1 rounded-t bg-gradient-to-t from-blue-600 to-sky-400 " + h} />
					))}
				</div>
			</div>
		</div>
	)
}

/* ============================================================
   Sections
   ============================================================ */
function Hero({ onNav }) {
	const { hero } = useContent()
	const ui = useUi()
	const clock = useClock()
	if (!hero) return null
	return (
		<section className="pb-10 pt-6 sm:pt-10">
			<div className="grid gap-4 sm:grid-cols-3">
				<div className="glass-card glass-hover flex flex-col p-7 sm:col-span-2 sm:row-span-2 sm:p-9">
					{hero.availability ? (
						<div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200/70">
							<span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
							{hero.availability}
						</div>
					) : null}
					<h1 className="max-w-xl text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-[52px]">
						{hero.headline}
					</h1>
					<p className="mt-5 max-w-lg text-[17px] leading-relaxed text-neutral-600">
						{hero.subheadline}
					</p>
					<div className="mt-7 flex flex-wrap items-center gap-3">
						<button
							onClick={() => onNav("projects")}
							className="inline-flex items-center gap-2 rounded-full bg-action px-5 py-2.5 text-sm font-medium text-white shadow-sm transition active:scale-[0.97]"
						>
							{ui.viewWork}
							<Ico name="arrow" className="h-4 w-4" />
						</button>
						<button
							onClick={() => onNav("contact")}
							className="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-medium text-ink ring-1 ring-neutral-300 transition hover:bg-white/60 active:scale-[0.97]"
						>
							{ui.contactCta}
						</button>
					</div>
					{Array.isArray(hero.roles) && hero.roles.length ? (
						<div className="mt-auto flex flex-wrap gap-1.5 pt-8">
							{hero.roles.map((r) => (
								<Chip key={r}>{r}</Chip>
							))}
						</div>
					) : null}
				</div>

				<div className="glass-card glass-hover flex flex-col gap-4 p-6">
					<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#13314f] to-action text-base font-semibold text-white shadow-inner">
						{hero.monogram}
					</div>
					<div>
						<div className="text-lg font-semibold tracking-tight text-ink">{hero.name}</div>
						<div className="text-sm text-neutral-500">{hero.title}</div>
					</div>
					<div className="mt-auto flex items-center gap-2 text-sm text-neutral-500">
						<Ico name="arrow" className="h-4 w-4 text-neutral-300" />
						{hero.location}
					</div>
				</div>

				<div className="glass-card glass-hover flex flex-col justify-between p-6">
					<div className="font-mono text-[11px] uppercase tracking-[0.22em] text-neutral-400">{ui.localTime}</div>
					<div className="font-mono text-3xl font-medium tabular-nums tracking-tight text-ink">{clock}</div>
					<div className="text-xs text-neutral-500">{ui.tz}</div>
				</div>
			</div>
		</section>
	)
}

function Summary() {
	const { summary } = useContent()
	if (!summary) return null
	return (
		<section className="py-10">
			<SectionHead index="01" eyebrow={summary.eyebrow} title={summary.title} />
			<div className="glass-card p-7 sm:p-9">
				<p className="max-w-3xl text-lg leading-relaxed text-neutral-700">{summary.body}</p>
				{Array.isArray(summary.stats) && summary.stats.length ? (
					<div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-neutral-200/60 sm:grid-cols-4">
						{summary.stats.map((s, i) => (
							<div key={i} className="bg-white/70 p-5">
								<div className="font-mono text-2xl font-semibold tabular-nums text-action">{s.value}</div>
								<div className="mt-1 text-sm text-neutral-500">{s.label}</div>
							</div>
						))}
					</div>
				) : null}
			</div>
		</section>
	)
}

function Experience() {
	const { experience } = useContent()
	if (!experience) return null
	return (
		<section className="py-10">
			<SectionHead index="02" eyebrow={experience.eyebrow} title={experience.title} />
			<ol className="relative space-y-4 border-l border-neutral-300/70 pl-7">
				{(experience.items || []).map((x, i) => (
					<li key={i} className="relative">
						<span className="absolute -left-[33px] top-5 h-2.5 w-2.5 rounded-full bg-action ring-4 ring-[#eceff4]" />
						<div className="glass-card glass-hover p-5 sm:p-6">
							<div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
								<h3 className="text-[15px] font-semibold text-ink">
									{x.role} <span className="text-neutral-300">·</span> <span className="text-action">{x.company}</span>
								</h3>
								<span className="font-mono text-[11px] uppercase tracking-wider text-neutral-400">{x.period}</span>
							</div>
							{x.location ? <div className="mt-0.5 text-xs text-neutral-500">{x.location}</div> : null}
							<p className="mt-2.5 text-sm leading-relaxed text-neutral-600">{x.description}</p>
							{Array.isArray(x.tags) && x.tags.length ? (
								<div className="mt-3.5 flex flex-wrap gap-1.5">
									{x.tags.map((t) => (
										<Chip key={t}>{t}</Chip>
									))}
								</div>
							) : null}
						</div>
					</li>
				))}
			</ol>
		</section>
	)
}

function Education() {
	const { education } = useContent()
	if (!education) return null
	return (
		<section className="py-10">
			<SectionHead index="03" eyebrow={education.eyebrow} title={education.title} />
			<div className="grid gap-4 sm:grid-cols-2">
				{(education.items || []).map((e, i) => (
					<div key={i} className="glass-card glass-hover p-6">
						<div className="flex items-baseline justify-between gap-3">
							<h3 className="text-base font-semibold text-ink">{e.school}</h3>
							<span className="font-mono text-[11px] uppercase tracking-wider text-neutral-400">{e.period}</span>
						</div>
						<div className="mt-1 text-sm text-action">{e.degree}</div>
						{e.detail ? <p className="mt-2 text-sm leading-relaxed text-neutral-600">{e.detail}</p> : null}
					</div>
				))}
			</div>
		</section>
	)
}

function Skills() {
	const { skills } = useContent()
	if (!skills) return null
	return (
		<section className="py-10">
			<SectionHead index="04" eyebrow={skills.eyebrow} title={skills.title} />
			<div className="glass-card divide-y divide-neutral-200/70 p-2 sm:p-3">
				{(skills.groups || []).map((g, i) => (
					<div key={i} className="grid gap-3 px-4 py-5 sm:grid-cols-[180px_1fr] sm:px-5">
						<div className="flex items-center gap-2">
							<span className="h-1.5 w-1.5 rounded-full bg-action" />
							<span className="text-sm font-semibold text-ink">{g.name}</span>
						</div>
						<div className="flex flex-wrap gap-1.5">
							{(g.items || []).map((s) => (
								<Chip key={s}>{s}</Chip>
							))}
						</div>
					</div>
				))}
			</div>
		</section>
	)
}

function Projects() {
	const { projects } = useContent()
	if (!projects) return null
	const items = projects.items || []
	return (
		<section className="py-10">
			<SectionHead index="05" eyebrow={projects.eyebrow} title={projects.title} />
			<div className="grid gap-4 sm:grid-cols-2">
				{items.map((p, i) => {
					const feature = i === 0
					const variant = i % 4
					return (
						<a
							key={i}
							href={p.link || "#"}
							target={p.link ? "_blank" : undefined}
							rel="noreferrer"
							className={"glass-card glass-hover group block p-3 " + (feature ? "sm:col-span-2" : "")}
						>
							<div className={feature ? "grid items-stretch gap-4 sm:grid-cols-2" : ""}>
								<div className={feature ? "min-h-[200px]" : "h-36"}>
									<MockChrome>
										<Mock variant={feature ? 0 : variant} />
									</MockChrome>
								</div>
								<div className={feature ? "flex flex-col justify-center px-2 sm:px-3" : "mt-3 px-1"}>
									<div className="flex items-start justify-between gap-3">
										<h3 className={"font-semibold tracking-tight text-ink " + (feature ? "text-xl" : "text-base")}>
											{p.name}
										</h3>
										<span className="mt-1 text-neutral-300 transition group-hover:translate-x-0.5 group-hover:text-action">
											<Ico name="arrow" className="h-4 w-4" />
										</span>
									</div>
									<p className="mt-1.5 text-sm leading-relaxed text-neutral-600">{p.description}</p>
									<div className="mt-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-neutral-400">
										<span>{p.category}</span>
										<span className="text-neutral-300">·</span>
										<span>{p.year}</span>
									</div>
								</div>
							</div>
						</a>
					)
				})}
			</div>
		</section>
	)
}

function Contact() {
	const { contact } = useContent()
	if (!contact) return null
	return (
		<section className="py-12">
			<div className="glass-card overflow-hidden p-8 sm:p-12">
				<div className="font-mono text-[11px] uppercase tracking-[0.22em] text-action">{contact.eyebrow}</div>
				<h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{contact.title}</h2>
				{contact.blurb ? <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-neutral-600">{contact.blurb}</p> : null}
				<div className="mt-7 flex flex-wrap items-center gap-3">
					<a
						href={"mailto:" + (contact.email || "")}
						className="inline-flex items-center gap-2 rounded-full bg-action px-5 py-2.5 text-sm font-medium text-white shadow-sm transition active:scale-[0.97]"
					>
						<Ico name="mail" className="h-4 w-4" />
						{contact.email}
					</a>
					{(contact.socials || []).map((s) => (
						<a
							key={s.label}
							href={s.url || "#"}
							target="_blank"
							rel="noreferrer"
							className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium text-ink ring-1 ring-neutral-300 transition hover:bg-white/60 active:scale-[0.97]"
						>
							{s.label}
							<span className="text-neutral-400">{s.handle}</span>
						</a>
					))}
				</div>
			</div>
		</section>
	)
}

/* ============================================================
   Browser webpage (nav + sections inside the Safari window)
   ============================================================ */
const NAV = ["summary", "experience", "education", "skills", "projects", "contact"]

function LangSwitcher() {
	const { languages, lang, setLang } = useApp()
	if (!languages || !languages.length) return null
	return (
		<div className="flex items-center gap-0.5 rounded-full bg-white/50 p-0.5 ring-1 ring-neutral-300/70">
			{languages.map((l) => (
				<button
					key={l.code}
					onClick={() => setLang(l.code)}
					title={l.label}
					className={
						"rounded-full px-2 py-1 text-[11px] font-semibold leading-none transition " +
						(lang === l.code ? "bg-action text-white shadow-sm" : "text-neutral-500 hover:text-ink")
					}
				>
					{l.short}
				</button>
			))}
		</div>
	)
}

function Webpage() {
	const app = useApp()
	const { hero } = app.content
	const meta = app.meta
	const ui = app.ui
	const scroller = useRef(null)
	const progress = useRef(null)
	const [active, setActive] = useState("summary")

	const onNav = (id) => {
		const root = scroller.current
		if (!root) return
		if (id === "top") {
			root.scrollTo({ top: 0, behavior: "smooth" })
			return
		}
		const el = root.querySelector("#sec-" + id)
		if (el) root.scrollTo({ top: el.offsetTop - 64, behavior: "smooth" })
	}

	const onScroll = () => {
		const root = scroller.current
		if (!root) return
		const max = root.scrollHeight - root.clientHeight
		const ratio = max > 0 ? root.scrollTop / max : 0
		if (progress.current) progress.current.style.transform = "scaleX(" + ratio + ")"
		const pos = root.scrollTop + 80
		let current = NAV[0]
		for (const n of NAV) {
			const el = root.querySelector("#sec-" + n)
			if (el && el.offsetTop <= pos) current = n
		}
		setActive(current)
	}

	return (
		<div ref={scroller} onScroll={onScroll} className="safari-scroll relative h-full overflow-y-auto page-canvas">
			<div className="reveal relative min-h-full">
				<div className="texture">
					<div className="dots" />
					<div className="grain" />
				</div>

				<div className="relative z-10">
					{/* sticky in-page nav */}
					<div className="sticky top-0 z-30">
						<div className="glass border-b border-white/40">
							<Container className="flex h-14 items-center justify-between">
								<button onClick={() => onNav("top")} className="flex items-center gap-2.5">
									<span className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-[#13314f] to-action text-[11px] font-semibold text-white shadow-inner">
										{hero ? hero.monogram : ""}
									</span>
									<span className="text-sm font-semibold tracking-tight text-ink">{hero ? hero.name : ""}</span>
								</button>
								<nav className="hidden items-center gap-1 md:flex">
									{NAV.map((n) => (
										<button
											key={n}
											onClick={() => onNav(n)}
											className={
												"rounded-full px-3 py-1.5 text-[13px] font-medium transition " +
												(active === n ? "bg-white/70 text-action" : "text-neutral-500 hover:text-ink")
											}
										>
											{ui.nav[n]}
										</button>
									))}
								</nav>
								<div className="flex items-center gap-2">
									<LangSwitcher />
									<a
										href={"mailto:" + (useContentEmail() || "")}
										className="hidden rounded-full bg-action px-4 py-1.5 text-[13px] font-medium text-white transition active:scale-95 sm:inline-flex"
									>
										{ui.getInTouch}
									</a>
								</div>
							</Container>
						</div>
						<div ref={progress} className="scroll-progress" />
					</div>

					<Container>
						<div id="sec-top"><Hero onNav={onNav} /></div>
						<div id="sec-summary"><Summary /></div>
						<div id="sec-experience"><Experience /></div>
						<div id="sec-education"><Education /></div>
						<div id="sec-skills"><Skills /></div>
						<div id="sec-projects"><Projects /></div>
						<div id="sec-contact"><Contact /></div>
						<footer className="border-t border-neutral-200/70 py-8 text-center text-xs text-neutral-400">
							© {new Date().getFullYear()} {hero ? hero.name : ""} · {meta ? meta.domain : ""}
						</footer>
					</Container>
				</div>
			</div>
		</div>
	)
}

function useContentEmail() {
	const c = useContent()
	return c && c.contact ? c.contact.email : ""
}

/* ============================================================
   Safari window chrome
   ============================================================ */
function SafariWindow({ stateClass }) {
	const { meta } = useApp()
	const domain = meta ? meta.domain : ""
	return (
		<div className={"safari-window absolute inset-x-2 bottom-2 top-9 overflow-hidden rounded-xl sm:inset-x-8 sm:bottom-7 sm:top-12 " + stateClass}>
			<div className="flex items-center gap-3 border-b border-black/10 bg-[#f6f6f7] px-4 py-2.5">
				<div className="flex items-center gap-2">
					<span className="h-3 w-3 rounded-full bg-[#ff5f57] ring-1 ring-black/5" />
					<span className="h-3 w-3 rounded-full bg-[#febc2e] ring-1 ring-black/5" />
					<span className="h-3 w-3 rounded-full bg-[#28c840] ring-1 ring-black/5" />
				</div>
				<div className="hidden items-center gap-1 text-neutral-400 sm:flex">
					<Ico name="back" className="h-4 w-4" />
					<Ico name="forward" className="h-4 w-4" />
				</div>
				<div className="mx-auto flex w-full max-w-md items-center justify-center gap-2 rounded-lg bg-white px-3 py-1.5 text-xs text-neutral-500 ring-1 ring-black/5">
					<Ico name="lock" className="h-3 w-3" />
					<span className="truncate">{domain}</span>
				</div>
				<div className="hidden items-center gap-2 text-neutral-400 sm:flex">
					<Ico name="share" className="h-4 w-4" />
					<Ico name="plus" className="h-4 w-4" />
				</div>
			</div>
			<div className="h-[calc(100%-49px)]">
				<Webpage />
			</div>
		</div>
	)
}

/* ============================================================
   Root
   ============================================================ */
export default function App() {
	const { data, error } = useLoadedContent()
	const [phase, setPhase] = useState(0)
	const [dockHover, setDockHover] = useState(false)
	const [lang, setLangState] = useState(null)

	useEffect(() => {
		if (!data) return
		let saved = null
		try {
			saved = localStorage.getItem("lang")
		} catch (e) {}
		const codes = (data.languages || []).map((l) => l.code)
		const initial = saved && codes.indexOf(saved) >= 0 ? saved : (data.meta && data.meta.defaultLang) || codes[0] || "id"
		setLangState(initial)
	}, [data])

	const setLang = (code) => {
		setLangState(code)
		try {
			localStorage.setItem("lang", code)
		} catch (e) {}
	}

	useEffect(() => {
		const t = []
		t.push(setTimeout(() => setPhase(1), 500))
		t.push(setTimeout(() => setPhase(2), 1650))
		t.push(setTimeout(() => setPhase(3), 2000))
		t.push(setTimeout(() => setPhase(4), 3050))
		return () => t.forEach(clearTimeout)
	}, [])

	useEffect(() => {
		const h = (e) => {
			if (e.key === "Escape") setPhase(4)
		}
		window.addEventListener("keydown", h)
		return () => window.removeEventListener("keydown", h)
	}, [])

	const booted = phase >= 3
	const done = phase >= 4
	const stateClass = booted ? (done ? "" : "window-in") : "window-hidden"

	if (!data) {
		return (
			<div className="desktop flex h-full items-center justify-center text-white/80">
				{error ? "Tidak bisa memuat content.json" : "Memuat…"}
			</div>
		)
	}

	const activeLang = lang || (data.meta && data.meta.defaultLang) || (data.languages && data.languages[0] && data.languages[0].code) || "id"
	const appValue = {
		meta: data.meta,
		languages: data.languages || [],
		lang: activeLang,
		setLang: setLang,
		content: data.content ? data.content[activeLang] : null,
		ui: data.ui ? data.ui[activeLang] : null,
	}

	return (
		<ContentCtx.Provider value={appValue}>
			<div className="desktop relative h-full overflow-hidden">
				<MenuBar />
				<SafariWindow stateClass={stateClass} />
				{!booted ? <MacCursor phase={phase} /> : null}
				<div className="dock-reveal-zone" onMouseEnter={() => setDockHover(true)} />
				<Dock
					down={done && !dockHover}
					bounceSafari={phase === 2}
					booted={booted}
					onLaunch={() => setPhase(4)}
					onHover={setDockHover}
				/>
			</div>
		</ContentCtx.Provider>
	)
}
