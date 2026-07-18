# 🌳 My Portfolio — Tree of Life

An interactive portfolio told as a growing tree. The page opens at the roots —
where my story begins — and as you **scroll upward**, the tree grows with you:
each stage of my journey appears as a floating card along the trunk, from my
first programming courses all the way up to the open sky above the crown.

> *"For a growing tree, the sky is not the limit."*

## ✨ How it works

- **Procedurally generated tree** — the whole tree (trunk, branches, roots,
  leaves, clouds and birds) is drawn at load time as SVG using a recursive
  branching algorithm. A seeded random generator keeps the tree the same on
  every visit, while still looking organic.
- **Scroll-driven storytelling** — the page starts at the bottom (the roots)
  and is six screens tall. Milestone cards fade in as they enter the viewport
  and fade out as they leave, powered by an `IntersectionObserver` — no scroll
  math, no jank.
- **A finale in the clouds** — the last card sits above the crown, glowing and
  shimmering against the sky.
- **Zero dependencies** — plain HTML, CSS and vanilla JavaScript. No
  frameworks, no build step.

## 🚀 Running it

Just open `index.html` in a browser. That's it.

```
git clone https://github.com/ItsSelma/MyPortofolio.git
cd MyPortofolio
start index.html      # Windows
```

## 📁 Project structure

| File            | Purpose                                                |
| --------------- | ------------------------------------------------------ |
| `index.html`    | Page skeleton and the milestone info panels            |
| `style.css`     | Sky gradient, glassmorphism panels, animations, layout |
| `javascript.js` | Procedural SVG tree generation and scroll-reveal logic |

## 🌱 The milestones

From the roots to the sky: primary school & Gimnazija Mostar → first
programming courses at the King Fahd Cultural Center → Faculty of Information
Technologies in Mostar → languages & technologies (C++, C#, Python, JS, …) →
a geolocation tracker for people with Alzheimer's → Cisco cybersecurity
courses → internship at Garaža-Makerspace → an "Introduction to Cyber
Security" workshop → facilitating the EU's GenChange project.

## 👩‍💻 Author

**Selma Omerika** — Software Engineering student at the Faculty of Information
Technologies in Mostar.

Stay tuned — the tree is still growing. 🌳
