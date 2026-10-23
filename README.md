# 🌌 Git Galaxy — Explore GitHub in 3D

<p align="center">
  <img src="https://img.shields.io/badge/GitHub-Profile%20Explorer-111827?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Profile Explorer" />
  <img src="https://img.shields.io/badge/Interactive-3D%20Universe-0ea5e9?style=for-the-badge&logo=threedotjs&logoColor=white" alt="Interactive 3D Universe" />
  <img src="https://img.shields.io/badge/Status-Actively%20Building-f59e0b?style=for-the-badge" alt="Actively Building" />
</p>

<p align="center">
  <strong>Turn GitHub profiles into interactive 3D galaxies.</strong>
  <br />
  Explore repositories as planets, discover developers as stars, and navigate the GitHub universe.
</p>

<p align="center">
  <a href="https://gitgalaxy.owsam22.com/">
    <img src="https://img.shields.io/badge/🚀_Explore_Git_Galaxy-Visit_Live_Demo-0ea5e9?style=for-the-badge" alt="Explore Git Galaxy live demo" />
  </a>
  <a href="https://github.com/owsam22">
    <img src="https://img.shields.io/badge/Developer-owsam22-181717?style=for-the-badge&logo=github" alt="Developer GitHub profile" />
  </a>
</p>

---

## ✨ Discover a Different Side of GitHub

**Git Galaxy** is an interactive 3D GitHub profile explorer that transforms repositories, developer profiles, and repository statistics into an immersive cosmic experience.

Instead of browsing a traditional list of repositories, explore a navigable universe where repositories become planets and developers become stars.

> 🚧 **Work in Progress:** Git Galaxy is actively evolving, with new features, visual improvements, and exploration experiences being developed over time.

## 🌠 Explore the Universe

<p align="center">
  <a href="https://gitgalaxy.owsam22.com/">
    <img src="https://img.shields.io/badge/OPEN_LIVE_DEMO-Explore_the_Universe-38bdf8?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Open the Git Galaxy live demo" />
  </a>
</p>

1. **Search** — Enter a GitHub username to explore their profile.
2. **Navigate** — Rotate, zoom, and pan through the interactive 3D environment.
3. **Discover** — Select repository planets to inspect available repository details.
4. **Travel** — Explore other users' galaxies through the interactive universe.
5. **Share** — Send a direct link to a profile's galaxy.

**Example:** Explore the developer profile at [gitgalaxy.owsam22.com/owsam22](https://gitgalaxy.owsam22.com/owsam22).

---

## 🚀 Features

| Feature | Description |
| --- | --- |
| 🌞 **Personalized Star Systems** | Visualize a GitHub profile through a central star and profile-related statistics. |
| 🪐 **Repository Planets** | Explore repositories as individual planets with visual properties influenced by repository data. |
| 🌌 **Universe Exploration** | Navigate a cosmic environment and discover other developers. |
| ⚡ **Cinematic Transitions** | Experience animated camera movement and warp-style transitions between galaxies. |
| ✨ **Cosmic Visual Effects** | Explore a 3D environment with animated stars, custom shaders, and atmospheric effects. |
| 📊 **Repository Insights** | Inspect available repository information, statistics, and programming languages. |
| 🔗 **Shareable Profiles** | Open and share profile-specific galaxy URLs. |
| 🪟 **Embed Support** | Embed a supported profile view into another website using the embed mode. |
| 🖱️ **Interactive Controls** | Rotate, zoom, pan, and interact with the 3D scene. |

*Visual representations are designed to make GitHub profile and repository data more engaging to explore.*

## 🛠️ Built With

<p>
  <img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Three.js-000000?style=flat-square&logo=threedotjs&logoColor=white" alt="Three.js" />
  <img src="https://img.shields.io/badge/React_Three_Fiber-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React Three Fiber" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/GitHub_API-181717?style=flat-square&logo=github&logoColor=white" alt="GitHub API" />
</p>

| Technology | Purpose |
| --- | --- |
| React | Component-based user interface |
| Three.js | Real-time 3D graphics |
| React Three Fiber | Three.js rendering in React |
| Framer Motion | UI animations and transitions |
| Vite | Frontend development and production builds |
| Node.js and Express | Backend API |
| MongoDB Atlas | Database and persistent application data |
| GitHub REST API / GraphQL | GitHub profile and repository data, where supported |
| Vanilla CSS | Custom styling and visual presentation |

## 🧭 Profile URLs and Embedding

### Open a developer's galaxy

Use the following URL pattern:

```text
https://gitgalaxy.owsam22.com/<github-username>
```

For example:

```text
https://gitgalaxy.owsam22.com/owsam22
```

Replace `owsam22` with the GitHub username you want to explore.

### Embed a galaxy

Git Galaxy supports an embed mode for compatible profile views.

```html
<iframe
  src="https://gitgalaxy.owsam22.com/owsam22?embed=true"
  width="100%"
  height="600"
  title="Explore the Git Galaxy of owsam22"
  loading="lazy"
  allowfullscreen
  style="border: 0; border-radius: 12px;"
></iframe>
```

Replace `owsam22` with the target username. Check the live application for current embed behavior and any limitations.

## 💻 Run Locally

Want to explore the code or contribute? Follow these steps to run the project locally.

### Prerequisites

- Node.js and npm
- Git
- MongoDB Atlas or another supported MongoDB connection, if required by the backend
- GitHub API credentials, if required by your configured API integration

### 1. Clone the repository

```bash
git clone https://github.com/owsam22/git-galaxy
cd src
```


### 2. Install dependencies

For the frontend:

```bash
npm install
```

Install backend dependencies separately if the backend is maintained in a separate directory:

```bash
cd server
npm install
```

*Adjust the commands to match the current repository structure.*

### 3. Configure environment variables

Create the appropriate `.env` file or files using the environment variable names expected by the application.

Typical backend configuration may include:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GITHUB_TOKEN=your_github_token
```

These names are examples, not a verified list of the project's current configuration. Check the source code for the exact variables your version requires.

**Security:** Never commit real API tokens, database credentials, or secrets. Keep environment files out of version control.

### 4. Start the application

Run the frontend and backend using the scripts defined in their respective `package.json` files.

For a Vite frontend, the development command is commonly:

```bash
npm run dev
```

### 5. Create a production build

```bash
npm run build
```

Use the project's available preview or deployment scripts to test the production build locally.

## 🗺️ Project Overview

The application brings together a 3D frontend, GitHub data integration, and backend services to create a more visual way to explore developer profiles.

```text
Git Galaxy
├── Interactive 3D universe
├── GitHub profile exploration
├── Repository visualization
├── Repository details and statistics
├── Shareable profile routes
├── Embed mode
└── Backend and data services
```

*This is a conceptual overview, not a verified directory tree. Refer to the source repository for the actual file structure.*

## 🔮 What's Next?

Git Galaxy is a work in progress. Potential areas for future improvements include:

- 🌌 More ways to discover developers and repositories.
- 📈 Richer repository and profile insights.
- 🎨 Further improvements to the 3D environment.
- ⚡ Performance and loading optimizations.
- 📱 Better experiences across screen sizes and devices.
- 🧩 Expanded sharing and embedding capabilities.

These are possible development directions, not guarantees or confirmed release dates.

## 🤝 Contributing

Suggestions, bug reports, and ideas can help improve Git Galaxy.

1. Explore the [live application](https://gitgalaxy.owsam22.com/).
2. Report issues or propose improvements through the project's GitHub repository.
3. If contributing code, explain the problem your change solves and test it before submitting a pull request.

*Add the repository's actual Issues and Pull Requests links once its GitHub URL is confirmed.*

## 📄 License

This project is developed by [owsam22](https://github.com/owsam22).

Check the repository's `LICENSE` file for the applicable license and terms of use.

## ⭐ Support the Project

If you enjoy exploring GitHub in a new way, try [Git Galaxy](https://gitgalaxy.owsam22.com/), share a galaxy with a friend, and consider starring the repository on GitHub.

Your feedback helps the project grow. 🌌

---

<p align="center">
  <strong>Git Galaxy — Your code. Your planets. Your universe.</strong>
  <br />
  <a href="https://gitgalaxy.owsam22.com/">Explore the universe</a>
  ·
  <a href="https://github.com/owsam22">Follow the developer</a>
  ·
  <a href="https://portfolio.owsam22.com/">Developer portfolio</a>
</p>

<p align="center">
  <sub>GitHub profile explorer · 3D repository visualization · Interactive galaxy · React · Three.js · React Three Fiber · GitHub API · Full-stack web development</sub>
</p>