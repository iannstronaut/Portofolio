import React, { useState, useEffect, useLayoutEffect, useRef } from "react"

/* ============================================================
   Content loading
   - Vite/production: fetched from /content.json at runtime, so the site
     can be re-edited without rebuilding or redeploying.
   - Standalone preview.html: reads window.__CONTENT__ (inlined), because
     file:// cannot fetch local JSON.
   ============================================================ */

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

const CV_FILE = "FullStack Developer_Al Byan Agung Shafiqri_Eng.pdf"
const SECTIONS = ["summary", "experience", "proProjects", "openProjects", "education", "skills", "certificates", "contact"]
const sectionId = (name) => `sec-${name}`
const sectionHref = (name) => `#${sectionId(name)}`

const DOCK_ICONS = {
	safari: <><circle cx="12" cy="12" r="8.5" /><path d="M15.8 8.2 13.6 13.6 8.2 15.8l2.2-5.4z" fill="currentColor" /><path d="M12 3.5v1.25m0 14.5v1.25M3.5 12h1.25m14.5 0h1.25" /></>,
	cv: <><path d="M6 3.5h8l4 4v13H6z" /><path d="M14 3.5v4h4M9 12h6m-6 3.5h6" /></>,
	github: <><path d="M9 19c-3.4.9-3.4-1.6-4.8-2m9.6 4v-2.5a2.3 2.3 0 0 0-.6-1.8c2.2-.25 4.5-1.1 4.5-4.9a3.8 3.8 0 0 0-1-2.7 3.5 3.5 0 0 0-.1-2.7s-.85-.27-2.8 1a10.6 10.6 0 0 0-5.1 0c-1.95-1.27-2.8-1-2.8-1a3.5 3.5 0 0 0-.1 2.7 3.8 3.8 0 0 0-1 2.7c0 3.8 2.3 4.65 4.5 4.9a2.3 2.3 0 0 0-.6 1.8V21" /></>,
	mail: <><rect x="3.5" y="5.5" width="17" height="13" rx="2" /><path d="m4 7 8 6 8-6" /></>,
}

function DockIcon({ name, label }) {
	return <>
		<span className={`dock-tile dock-${name}`} aria-hidden="true">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{DOCK_ICONS[name]}</svg>
		</span>
		<span className="dock-label" aria-hidden="true">{label}</span>
	</>
}

function MenuBar({ locale, label }) {
	const [now, setNow] = useState(() => new Date())
	useEffect(() => {
		const timer = window.setInterval(() => setNow(new Date()), 15000)
		return () => window.clearInterval(timer)
	}, [])
	const timeZone = "Asia/Jakarta"
	const date = now.toLocaleDateString(locale, { timeZone, weekday: "short", day: "numeric", month: "short" })
	const time = now.toLocaleTimeString(locale, { timeZone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
	return (
		<div className="mac-menu">
			<span className="mac-menu-app"><strong>Safari</strong><span>{label}</span></span>
			<time dateTime={now.toISOString()} title="Asia/Jakarta">{date}<span>{time} WIB</span></time>
		</div>
	)
}

const reducedMotion = "(prefers-reduced-motion: reduce)"

function BootCursor({ onFinish }) {
	return (
		<svg className="boot-cursor" width="23" height="23" viewBox="0 0 24 24" aria-hidden="true" onAnimationEnd={onFinish}>
			<path d="M5 3l14 8-6 1.4 3.4 6.2-2.4 1.3-3.4-6.2L5 19z" fill="#fff" stroke="#111" strokeWidth="1.1" strokeLinejoin="round" />
		</svg>
	)
}

function SafariDesktop({ data, lang, setLang, assetPath }) {
	const [status, setStatus] = useState(() => window.matchMedia(reducedMotion).matches ? "open" : "booting")
	const [expanded, setExpanded] = useState(false)
	const launcher = useRef(null)
	const viewport = useRef(null)
	const userContent = data.content[lang]
	const ui = data.ui[lang]
	const contact = userContent.contact
	const github = contact?.socials?.find(({ label }) => label === "GitHub")
	const visible = status === "open"
	const booting = status === "booting"

	function hideWindow(nextStatus) {
		if (nextStatus === "closed") setExpanded(false)
		setStatus(nextStatus)
		launcher.current.focus({ preventScroll: true })
	}

	function openWindow() {
		setStatus("open")
		if (visible) viewport.current?.focus({ preventScroll: true })
	}

	useEffect(() => {
		if (visible && document.activeElement === launcher.current) viewport.current?.focus({ preventScroll: true })
	}, [visible])

	useEffect(() => {
		if (!booting) return
		const onKeyDown = (event) => {
			if (event.key === "Escape") setStatus("open")
		}
		const motion = window.matchMedia(reducedMotion)
		const onMotionChange = (event) => {
			if (event.matches) setStatus("open")
		}
		window.addEventListener("keydown", onKeyDown)
		motion.addEventListener("change", onMotionChange)
		return () => {
			window.removeEventListener("keydown", onKeyDown)
			motion.removeEventListener("change", onMotionChange)
		}
	}, [booting])

	return (
		<div className="mac-desktop">
			<MenuBar locale={lang === "jw" ? "jv" : lang} label={ui.desktop.portfolio} />
			<div className={`mac-workspace${expanded ? " mac-expanded" : ""}`}>
				<div className="safari-window" hidden={!visible}>
					<header className="safari-toolbar">
						<div className="window-controls">
							<button type="button" className="window-close" title={ui.desktop.close} aria-label={ui.desktop.close} onClick={() => hideWindow("closed")}>×</button>
							<button type="button" className="window-minimize" title={ui.desktop.minimize} aria-label={ui.desktop.minimize} onClick={() => hideWindow("minimized")}>−</button>
							<button type="button" className="window-expand" title={ui.desktop.expand} aria-label={ui.desktop.expand} aria-pressed={expanded} onClick={() => setExpanded(!expanded)}>↗</button>
						</div>
						<div className="safari-address">
							<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><rect x="4" y="7" width="8" height="6" rx="1" /><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" /></svg>
							{data.meta.domain}
						</div>
					</header>
					<div className="browser-viewport" id="safari-portfolio" ref={viewport} tabIndex={-1}>
						{!booting && status !== "closed" && <Portfolio data={data} lang={lang} setLang={setLang} assetPath={assetPath} viewport={viewport} />}
					</div>
				</div>
			</div>
			<div className="mac-dock">
				<button ref={launcher} type="button" className="dock-item" aria-label={ui.desktop.open} aria-controls="safari-portfolio" aria-expanded={visible} onClick={openWindow}>
					<DockIcon name="safari" label="Safari" />
					{booting && <BootCursor onFinish={openWindow} />}
				</button>
				<a className="dock-item" href={assetPath + CV_FILE} download={CV_FILE} aria-label={ui.downloadCv}><DockIcon name="cv" label={ui.downloadCv} /></a>
				{github?.url && <a className="dock-item" href={github.url} target="_blank" rel="noreferrer" aria-label="GitHub"><DockIcon name="github" label="GitHub" /></a>}
				{contact?.email && <a className="dock-item" href={`mailto:${contact.email}`} aria-label={ui.nav.contact}><DockIcon name="mail" label={ui.nav.contact} /></a>}
			</div>
		</div>
	)
}

function Topbar({ hero, ui, languages, lang, setLang, active }) {
	const navigation = useRef(null)

	useEffect(() => {
		const nav = navigation.current
		const link = nav.querySelector('[aria-current="location"]')
		if (!link || nav.scrollWidth <= nav.clientWidth) return
		const navBounds = nav.getBoundingClientRect()
		const linkBounds = link.getBoundingClientRect()
		if (linkBounds.left < navBounds.left || linkBounds.right > navBounds.right) {
			nav.scrollLeft += (linkBounds.left + linkBounds.right - navBounds.left - navBounds.right) / 2
		}
	}, [active, lang])

	return (
		<header className="site-topbar">
			<div className="topbar-inner">
				<a href={sectionHref("top")} className="brand" aria-label={hero.name}>
					<span className="monogram" aria-hidden="true">{hero.monogram}</span>
					<span className="brand-name">{hero.name}</span>
				</a>
				<nav className="site-nav" aria-label={ui.desktop.portfolio} ref={navigation}>
					{SECTIONS.map((name) => (
						<a href={sectionHref(name)} key={name} aria-current={active === name ? "location" : undefined}>
							{ui.nav[name]}
						</a>
					))}
				</nav>
				<div className="languages" role="group" aria-label={ui.language}>
					{languages.map((language) => (
						<button key={language.code} type="button" lang={language.code === "jw" ? "jv" : language.code}
							aria-label={language.label} aria-pressed={lang === language.code} onClick={() => setLang(language.code)}>
							{language.short}
						</button>
					))}
				</div>
			</div>
		</header>
	)
}

function ChipList({ items }) {
	if (!items?.length) return null
	return (
		<ul className="chip-list">
			{items.map((item) => <li key={item}>{item}</li>)}
		</ul>
	)
}

function LocalClock({ label }) {
	const formatTime = () => new Date().toLocaleTimeString("en-GB", {
		timeZone: "Asia/Jakarta", hour: "2-digit", minute: "2-digit",
	})
	const [time, setTime] = useState(formatTime)
	useEffect(() => {
		const timer = window.setInterval(() => setTime(formatTime()), 15000)
		return () => window.clearInterval(timer)
	}, [])
	return (
		<div className="glass-card glass-hover hero-clock">
			<span className="eyebrow">{label}</span>
			<time>{time}</time>
			<span>Jakarta · GMT+7</span>
		</div>
	)
}

function Hero({ hero, ui, assetPath }) {
	return (
		<header id={sectionId("top")} className="hero">
			<div className="glass-card glass-hover hero-lead">
				{hero.availability && <p className="availability">{hero.availability}</p>}
				<h1>{hero.headline || hero.name}</h1>
				<p className="hero-intro">{hero.subheadline}</p>
				<div className="hero-actions">
					<a className="button button-primary" href={assetPath + CV_FILE} download={CV_FILE}>{ui.downloadCv}</a>
					<a className="button button-secondary" href={sectionHref("proProjects")}>{ui.viewWork}<span aria-hidden="true">→</span></a>
				</div>
				<ChipList items={hero.roles} />
			</div>
			<div className="glass-card glass-hover hero-profile">
				<span className="profile-monogram" aria-hidden="true">{hero.monogram}</span>
				<div><p>{hero.name}</p><span>{hero.title}</span></div>
				<span>{hero.location}</span>
			</div>
			<LocalClock label={ui.localTime} />
		</header>
	)
}

function Section({ name, data, children, className = "" }) {
	const id = sectionId(name)
	return (
		<section id={id} aria-labelledby={`${id}-title`} className={`portfolio-section ${className}`}>
			<div className="section-heading">
				{data.eyebrow && <p className="eyebrow">{data.eyebrow}</p>}
				<h2 id={`${id}-title`}>{data.title}</h2>
			</div>
			{children}
		</section>
	)
}

function Summary({ data }) {
	return (
		<Section name="summary" data={data}>
			<div className="glass-card summary-card">
				<p className="summary-copy">{data.body}</p>
				{data.stats?.length > 0 && (
					<dl className="stats">
						{data.stats.map(({ value, label }) => (
							<div key={label}><dt>{label}</dt><dd>{value}</dd></div>
						))}
					</dl>
				)}
			</div>
		</Section>
	)
}

function Experience({ data }) {
	return (
		<Section name="experience" data={data}>
			<ol className="timeline">
				{data.items.map((item) => (
					<li className="glass-card glass-hover content-card" key={`${item.company}-${item.role}`}>
						<div className="card-top"><h3>{item.role}</h3><p className="row-meta">{item.period}</p></div>
						<p className="attribution">{[item.company, item.type, item.location].filter(Boolean).join(" · ")}</p>
						{item.description && <p className="description">{item.description}</p>}
						<ChipList items={item.tags} />
					</li>
				))}
			</ol>
		</Section>
	)
}

function ProjectThumbnail({ variant }) {
	return (
		<div className={`mini-win mini-${variant}`} aria-hidden="true">
			<div className="mini-toolbar"><i /><i /><i /><b /></div>
			<div className="mini-stage">
				<i /><i /><i /><i /><i /><i /><i />
			</div>
		</div>
	)
}

function ProjectList({ name, data }) {
	const variants = name === "proProjects" ? ["chart", "tiles", "chart"] : ["tiles", "editor"]
	return (
		<Section name={name} data={data}>
			<ul className="card-grid">
				{data.items.map((project, i) => {
					const featured = i === 0 && data.items.length % 2 === 1
					const linked = project.link && project.link !== "#"
					const Tag = linked ? "a" : "div"
					return (
						<li className={featured ? "project-feature" : undefined} key={project.name}>
							<Tag className="glass-card glass-hover project-card" href={linked ? project.link : undefined} target={linked ? "_blank" : undefined} rel={linked ? "noreferrer" : undefined}>
								<ProjectThumbnail variant={variants[i % variants.length]} />
								<div className="project-copy">
									<h3>{project.name}{linked && <span aria-hidden="true"> ↗</span>}</h3>
									<p className="description">{project.description}</p>
									<p className="row-meta">{project.category} · {project.year}</p>
									<ChipList items={project.tags} />
								</div>
							</Tag>
						</li>
					)
				})}
			</ul>
		</Section>
	)
}

function Education({ data }) {
	return (
		<Section name="education" data={data}>
			<ul className="card-grid">
				{data.items.map((item) => (
					<li className="glass-card glass-hover content-card" key={`${item.school}-${item.degree}`}>
						<div className="card-top"><h3>{item.school}</h3><p className="row-meta">{item.period}</p></div>
						<p className="attribution">{item.degree}</p>
						{item.detail && <p className="description">{item.detail}</p>}
					</li>
				))}
			</ul>
		</Section>
	)
}

function Skills({ data }) {
	return (
		<Section name="skills" data={data}>
			<ul className="glass-card skills-card">
				{data.groups.map((group) => (
					<li key={group.name}><h3>{group.name}</h3><ChipList items={group.items} /></li>
				))}
			</ul>
		</Section>
	)
}

function Certificates({ data }) {
	return (
		<Section name="certificates" data={data}>
			<ul className="card-grid">
				{data.items.map((item) => (
					<li className="glass-card glass-hover content-card" key={`${item.name}-${item.issuer}`}>
						<div className="card-top"><h3>{item.name}</h3><p className="row-meta">{item.period}</p></div>
						<p className="attribution">{[item.issuer, item.location].filter(Boolean).join(" · ")}</p>
						{item.detail && <p className="description">{item.detail}</p>}
					</li>
				))}
			</ul>
		</Section>
	)
}

function Contact({ data }) {
	return (
		<Section name="contact" data={data} className="contact-section glass-card">
			{data.blurb && <p className="summary-copy">{data.blurb}</p>}
			<ul className="hero-actions">
				<li><a className="button button-primary contact-email" href={`mailto:${data.email}`}>{data.email}</a></li>
				{data.socials?.map(({ label, handle, url }) => (
					<li key={label}>
						{url && url !== "#" ? (
							<a className="button button-secondary" href={url} target="_blank" rel="noreferrer">{label} <span>{handle}</span></a>
						) : <span className="button contact-handle">{label} {handle}</span>}
					</li>
				))}
			</ul>
		</Section>
	)
}

function useActiveSection(viewport) {
	const [active, setActive] = useState(null)
	useEffect(() => {
		const root = viewport.current
		const sections = Array.from(root.querySelectorAll(".portfolio-section"))
		const target = document.getElementById(window.location.hash.slice(1))
		if (root.contains(target)) target.scrollIntoView()

		let frame = 0
		let offset = 0
		const update = () => {
			frame = 0
			if (!root.clientHeight) return
			const end = root.scrollHeight - root.clientHeight
			root.parentElement.style.setProperty("--scroll-progress", end > 0 ? Math.min(1, root.scrollTop / end) : 0)
			if (root.scrollTop <= 1) {
				setActive(null)
				return
			}
			const atBottom = end > 0 && Math.ceil(root.scrollTop) >= end
			const start = root.getBoundingClientRect().top + offset
			// A section near the end may not reach the top of the scroll area.
			if (atBottom) {
				const fragment = sections.find(({ id }) => `#${id}` === window.location.hash)
				if (fragment && fragment.getBoundingClientRect().top >= start) {
					setActive(fragment.id.slice(4))
					return
				}
			}
			for (let i = sections.length - 1; i >= 0; --i) {
				const section = sections[i]
				if (atBottom || section.getBoundingClientRect().top <= start) {
					setActive(section.id.slice(4))
					return
				}
			}
			setActive(null)
		}
		const onScroll = () => {
			if (!frame) frame = window.requestAnimationFrame(update)
		}
		const onResize = () => {
			offset = Number.parseFloat(getComputedStyle(root).scrollPaddingTop) + 20
			onScroll()
		}
		onResize()
		const resizeObserver = new ResizeObserver(onResize)
		resizeObserver.observe(root)
		resizeObserver.observe(root.querySelector(".site-shell"))
		root.addEventListener("scroll", onScroll, { passive: true })
		window.addEventListener("hashchange", onScroll)
		return () => {
			resizeObserver.disconnect()
			root.removeEventListener("scroll", onScroll)
			window.removeEventListener("hashchange", onScroll)
			window.cancelAnimationFrame(frame)
		}
	}, [viewport])
	return active
}

function Portfolio({ data, lang, setLang, assetPath, viewport }) {
	const { hero, summary, experience, proProjects, openProjects, projects, education, skills, certificates, certifications, contact } = data.content[lang]
	const ui = data.ui[lang]
	const active = useActiveSection(viewport)
	const languageAnchor = useRef(null)

	const selectLanguage = (nextLang) => {
		if (nextLang === lang) return
		const root = viewport.current
		const section = document.getElementById(sectionId(active || "top"))
		if (section) {
			languageAnchor.current = { id: section.id, top: section.getBoundingClientRect().top - root.getBoundingClientRect().top }
		}
		setLang(nextLang)
	}

	useLayoutEffect(() => {
		const anchor = languageAnchor.current
		if (!anchor) return
		languageAnchor.current = null
		const section = document.getElementById(anchor.id)
		if (!section) return
		const root = viewport.current
		root.scrollTop += section.getBoundingClientRect().top - root.getBoundingClientRect().top - anchor.top
	}, [lang, viewport])

	return (
		<div className="site-shell">
			<a className="skip-link" href="#main-content">{ui.skipToContent}</a>
			<Topbar hero={hero} ui={ui} languages={data.languages} lang={lang} setLang={selectLanguage} active={active} />
			<main id="main-content" className="site-main" tabIndex={-1}>
				<Hero hero={hero} ui={ui} assetPath={assetPath} />
				{summary && <Summary data={summary} />}
				{experience && <Experience data={experience} />}
				{proProjects && <ProjectList name="proProjects" data={proProjects} />}
				{(openProjects || projects) && <ProjectList name="openProjects" data={openProjects || projects} />}
				{education && <Education data={education} />}
				{skills && <Skills data={skills} />}
				{(certificates || certifications) && <Certificates data={certificates || certifications} />}
				{contact && <Contact data={contact} />}
				<footer className="site-footer">© {new Date().getFullYear()} {hero.name} <a href={sectionHref("top")}>{data.meta.domain} ↑</a></footer>
			</main>
		</div>
	)
}

export default function App() {
	const { data, error } = useLoadedContent()
	const [lang, setLang] = useState(() => {
		try {
			return localStorage.getItem("lang")
		} catch {
			return null
		}
	})
	const activeLang = data?.languages.some(({ code }) => code === lang) ? lang : data?.meta.defaultLang || "id"

	useEffect(() => {
		document.documentElement.lang = activeLang === "jw" ? "jv" : activeLang
	}, [activeLang])

	const selectLanguage = (code) => {
		setLang(code)
		try {
			localStorage.setItem("lang", code)
		} catch {
			// The selection still works when browser storage is unavailable.
		}
	}

	if (!data) {
		return <p className="load-status" role={error ? "alert" : "status"}>{error ? "Tidak bisa memuat content.json" : "Memuat…"}</p>
	}
	const assetPath = window.location.protocol === "file:" ? "public/" : ""
	return <SafariDesktop data={data} lang={activeLang} setLang={selectLanguage} assetPath={assetPath} />
}
