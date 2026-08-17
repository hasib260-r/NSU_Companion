
# 🍽️ NSU Companion
### *Smart Cafeteria & Pre-Ordering System*

[![Status](https://img.shields.io/badge/status-In%20Development-ffc107?style=for-the-badge&logo=github)](https://github.com/mnxtr/Software-engineering-project)
[![License](https://img.shields.io/badge/license-MIT-4caf50?style=for-the-badge&logo=open-source-initiative)](LICENSE)
[![Build](https://img.shields.io/badge/build-Passing-00c853?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/mnxtr/Software-engineering-project)
[![Node](https://img.shields.io/badge/node-v18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)

**Eliminating queues. Empowering campuses.**

[🚀 Getting Started](#-getting-started) • [📅 Timeline](#-project-timeline) • [👥 Team](#-team-members--roles) • [📚 Docs](#-documentation)

</div>

---

## 🎯 Overview

> **NSU Companion** is a smart cafeteria management and pre-ordering system built for **North South University (NSU)** — designed to eliminate long physical queues and streamline food ordering operations across campus.

### The Problem
Students and faculty at NSU face **long queues** at the cafeteria during peak hours, leading to time wastage and operational inefficiencies.

### Our Solution
A **comprehensive digital ecosystem** connecting three user types:

| 👤 Students & Faculty | 🏪 Vendors | ⚙️ Administrators |
|:---|:---|:---|
| Browse live menus | Manage menus & inventory | Configure system settings |
| Place pre-orders | Track incoming orders | Manage users & permissions |
| Secure payments | View real-time sales analytics | Monitor operations |
| Collect with unique tokens | Control item availability | Generate reports & audit logs |

---

## ✨ Key Features

| Feature | Description |
|:---|:---|
| 🍔 **Real-time Menu Management** | Dynamic pricing and live item availability |
| 💳 **Secure Payment Gateway** | SSLCommerz & bKash sandbox integration |
| 🔔 **Push Notifications** | Firebase Cloud Messaging for order updates |
| 📍 **Order Tracking** | Real-time preparation status with countdown timers |
| 🎫 **Unique Order Tokens** | Secure pickup identification system |
| 📊 **Vendor Dashboard** | Analytics, order management, menu control |
| 🛡️ **Admin Panel** | System configuration, user management, audit logs |
| 📱 **Mobile Responsive** | Seamless experience across all devices |

---

## 🏗️ Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black&style=flat-square)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white&style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square)
![Redux](https://img.shields.io/badge/Redux-764ABC?logo=redux&logoColor=white&style=flat-square)
![Webpack](https://img.shields.io/badge/Webpack-8DD6F9?logo=webpack&logoColor=black&style=flat-square)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white&style=flat-square)
![Express.js](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white&style=flat-square)
![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white&style=flat-square)
![WebSocket](https://img.shields.io/badge/WebSocket-010101?logo=socketdotio&logoColor=white&style=flat-square)

### Database & Infrastructure
![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white&style=flat-square)
![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white&style=flat-square)
![AWS](https://img.shields.io/badge/AWS-232F3E?logo=amazonaws&logoColor=white&style=flat-square)

### External Services
- 💰 **Payments:** SSLCommerz & bKash (Sandbox)
- 🔔 **Notifications:** Firebase Cloud Messaging
- 🗂️ **Version Control:** GitHub
- ☁️ **Hosting:** AWS (EC2, RDS) / Azure / On-campus Server

---

## 📅 Project Timeline

| Phase | Duration | Status | Key Deliverables |
|:---|:---|:---|:---|
| **Phase 0: Setup** | Jul 16 – Jul 21 | ✅ Complete | Repo, Slack, Trello, Calendar |
| **Phase 1: Backend** | Jul 22 – Aug 18 | 🔄 In Progress | APIs, Auth, DB, Payments |
| **Phase 2: Frontend** | Aug 19 – Sep 1 | ⏳ Upcoming | React App, Dashboard, Admin Panel |
| **Phase 3: Testing** | Sep 2 – Sep 15 | ⏳ Upcoming | Unit, Integration, E2E Tests |
| **🎯 Final Submission** | **Sep 15, 2026** | — | — |

### Phase 0 Checklist
- [x] Project Kickoff Meeting
- [x] GitHub repository setup with folder structure
- [x] Slack workspace configuration with integrations
- [x] Trello board with task tracking
- [x] Google Calendar events for milestones
- [ ] Local development environment setup
- [ ] Coding standards documentation
- [ ] Documentation tools evaluation

---

## 👥 Team Members & Roles

<table>
<tr>
<td align="center" width="33%">

**Mohammad Mansib Newaz**
<br>`1931842642`
<br>👑 *Project Coordinator*
<br><sub>Project planning • Trello • GitHub • Documentation oversight</sub>

</td>
<td align="center" width="33%">

**Faroque Hossain Rumi**
<br>`1931451942`
<br>⚡ *Tech Lead*
<br><sub>Backend architecture • Express.js • Database design • Coding standards</sub>

</td>
<td align="center" width="33%">

**Mohammad Hasibur Rahman**
<br>`2132403642`
<br>🎨 *Operations Lead*
<br><sub>Frontend development (React) • Slack setup • UI/UX implementation</sub>

</td>
</tr>
</table>

---

## 🚀 Getting Started

### Prerequisites
- Node.js `v18+`
- npm or yarn
- MySQL `8.0+`
- Git
- VS Code *(recommended)*

### Quick Setup

```bash
# 1. Clone the repository
git clone https://github.com/mnxtr/Software-engineering-project.git
cd Software-engineering-project

# 2. Setup backend
cd backend
npm install
cp .env.example .env
# → Configure database credentials and API keys in .env
npm run migrate
npm run seed
npm start

# 3. Setup frontend (new terminal)
cd ../frontend
npm install
cp .env.example .env
# → Configure API endpoint and Firebase keys in .env
npm start
```

🌐 Access Points

Service	URL
🎓 Student/Faculty App	`http://localhost:3000`
🏪 Vendor Dashboard	`http://localhost:3000/vendor`
⚙️ Admin Panel	`http://localhost:3000/admin`
🔌 Backend API	`http://localhost:5000`

---

📁 Project Structure

```
Software-engineering-project/
├── 📄 README.md
├── 🚫 .gitignore
├── 📂 docs/
│   ├── SRS.md
│   ├── Architecture.md
│   ├── API_Documentation.md
│   ├── Database_Schema.md
│   └── Deployment_Guide.md
├── 📂 backend/
│   ├── 📂 src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── config/
│   │   └── utils/
│   ├── 📂 tests/
│   ├── package.json
│   └── .env.example
├── 📂 frontend/
│   ├── 📂 src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   ├── hooks/
│   │   ├── styles/
│   │   └── App.jsx
│   ├── 📂 public/
│   ├── 📂 tests/
│   ├── package.json
│   └── .env.example
└── 📂 .github/
    └── 📂 workflows/
        └── ci-cd.yml
```

---

🔧 Development Workflow

Git Branching Strategy

```
main (production)
│
└── develop (integration)
    ├── feature/user-auth
    ├── feature/order-api
    ├── feature/payment-gateway
    ├── bugfix/login-issue
    └── release/v1.0
```

Commit Convention

```
<type>(<scope>): <subject>

<body>

<footer>
```

Type	Use For
`feat`	New features
`fix`	Bug fixes
`docs`	Documentation changes
`style`	Code style (formatting, semicolons, etc.)
`refactor`	Code refactoring
`test`	Adding or updating tests
`chore`	Build process or auxiliary tool changes

Example: `feat(auth): implement JWT authentication`

Pull Request Process
1. 🌿 Create feature branch from `develop`
2. ✏️ Make commits with clear messages
3. 📤 Push to GitHub and create Pull Request
4. 👀 Code review by Tech Lead
5. ✅ Merge after approval
6. 🗑️ Delete feature branch

---

📝 Coding Standards

React.js
- ✅ Functional components with hooks
- ✅ Airbnb React Hooks ESLint config
- ✅ Component naming: `PascalCase`
- ✅ File naming: `camelCase`
- ✅ Props validation with PropTypes

Express.js
- ✅ RESTful API design principles
- ✅ Request validation with Joi/Yup
- ✅ Error handling middleware
- ✅ Logging with Winston
- ✅ Environment variables for configuration

Database
- ✅ MySQL naming: `snake_case`
- ✅ Proper indexing on foreign keys
- ✅ Migrations for schema changes
- ✅ Seed data for development

---

🧪 Testing

```bash
# Backend tests
cd backend
npm run test              # Run all tests
npm run test:coverage     # Coverage report

# Frontend tests
cd frontend
npm run test              # Run all tests
npm run test:coverage     # Coverage report
```

---

📊 API Documentation

Full details in [`API_Documentation.md`](docs/API_Documentation.md):
- 🔐 Authentication endpoints
- 📦 Order management APIs
- 🍔 Menu management APIs
- 💳 Payment APIs
- ⚙️ Admin endpoints
- 🔌 WebSocket connections

---

🔐 Security Checklist

- JWT-based authentication
- Password hashing with bcrypt
- HTTPS/TLS encryption
- Input validation & sanitization
- SQL injection prevention
- XSS protection
- CSRF tokens
- Rate limiting

---

💬 Communication & Collaboration

Slack Workspace
Workspace: `group7-k8y3821`

Channel	Purpose
`#general`	Daily standups, announcements
`#development`	Code discussions, PRs
`#design`	UI/UX feedback
`#testing`	QA updates, bug reports
`#deployment`	DevOps, deployment logs
`#announcements`	Milestones, celebrations

📅 Weekly Standup
Every Monday at 10:00 AM (Asia/Dhaka)

🎯 Project Management
Trello: [NSU Companion Project](https://trello.com/b/LuWzursT/project-management)

📆 Calendar
Google Calendar: Shared with team (added at project setup)

---

📚 Documentation Hub

Document	Description
📄 [SRS Document](docs/SRS.md)	Software Requirements Specification
🏗️ [Architecture](docs/Architecture.md)	System architecture & design decisions
🗃️ [Database Schema](docs/Database_Schema.md)	Entity relationships & table designs
🔌 [API Documentation](docs/API_Documentation.md)	Endpoint reference & examples
⚙️ [Setup Guide](docs/Setup_Guide.md)	Detailed environment setup
🚀 [Deployment Guide](docs/Deployment_Guide.md)	Production deployment instructions

---

🐛 Issue Tracking

Found a bug? Have a feature request?

1. Check existing [Issues](https://github.com/mnxtr/Software-engineering-project/issues)
2. Create a new issue with:
   - Clear, descriptive title
   - Detailed description
   - Steps to reproduce (for bugs)
   - Expected vs. actual behavior
   - Screenshots (if applicable)

---

📋 Contributing

```bash
# 1. Fork the repository
# 2. Create your feature branch
git checkout -b feature/AmazingFeature

# 3. Commit your changes
git commit -m 'feat(scope): Add AmazingFeature'

# 4. Push to the branch
git push origin feature/AmazingFeature

# 5. Open a Pull Request
# 6. Wait for code review and merge 🎉
```

---

📈 Performance Goals

Metric	Target
⚡ Page Load Time	`< 3 seconds`
🌐 API Response Time	`< 200ms` (p95)
🗃️ Database Query Time	`< 100ms` (p95)
📱 Mobile Performance	`90+` Lighthouse score
🔒 Availability	`99.5%` uptime

---

🔄 CI/CD Pipeline

GitHub Actions automates:
- ✅ Code linting (ESLint)
- ✅ Unit tests (Jest, Mocha)
- ✅ Build verification
- ✅ Security scanning
- ✅ Automated deployment to staging

See [`.github/workflows`](.github/workflows) for configuration details.

---

📜 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

📞 Contact & Support

Role	Name
👑 Project Lead	Mohammad Mansib Newaz
⚡ Tech Lead	Faroque Hossain Rumi
🎨 Operations Lead	Mohammad Hasibur Rahman

Get in touch:
- 💬 Slack: `#general` channel (group7-k8y3821)
- 📧 Email: [Contact at NSU]
- 🐛 GitHub Issues: [Create an issue](https://github.com/mnxtr/Software-engineering-project/issues)

---

🙏 Acknowledgments

- 🎓 North South University (NSU) — Project sponsor
- 📚 CSE327 Software Engineering Course — Academic framework
- 🌍 Open Source Community — Libraries and tools used

---

📊 Project Statistics

Metric	Value
👥 Team Size	3 developers
⏱️ Duration	8 weeks (Jul 16 – Sep 15, 2026)
🎯 Target Users	5,000+ (NSU students & faculty)
💻 Languages	JavaScript / TypeScript
🗃️ Database Tables	15+
🔌 API Endpoints	40+
⚛️ React Components	50+

---

🎉 Latest Updates

Date	Milestone	Status
Jul 15	Project kickoff meeting agenda finalized	✅
Jul 15	Slack workspace (group7-k8y3821) setup complete	✅
Jul 15	Google Calendar events created for all milestones	✅
Jul 15	Project plan & Gantt chart generated	✅
Jul 16	Project Kickoff Meeting (10:00 AM)	🔄
Jul 17	GitHub repo initialization	⏳
Jul 22	Phase 1 (Backend) development begins	⏳

---

Made with ❤️ by the NSU Companion Team

---

🔗 Quick Links

[GitHub Repository](https://github.com/mnxtr/Software-engineering-project) •
[Trello Board](https://trello.com/b/LuWzursT/project-management) •
[Slack Workspace](https://group7-k8y3821.slack.com) •
[SRS Document](docs/SRS.md) •
[Project Timeline](docs/Gantt_Chart.md)

Happy Coding! 🚀

> Note: I can only provide the content directly in chat. To use this as your `README.md`, copy the code block above and paste it into your `README.md` file in your repository, then commit and push.