# Developer Guide

Coding standards, branching strategy, commit conventions, and workflows for the NSU Companion project.

---

## Git Branching Strategy

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

### Branch Naming

| Branch Type | Format | Example |
|-------------|--------|---------|
| Feature | `feature/<short-description>` | `feature/real-time-notifications` |
| Bugfix | `bugfix/<short-description>` | `bugfix/cart-quantity-overflow` |
| Release | `release/<version>` | `release/v1.1` |
| Hotfix | `hotfix/<short-description>` | `hotfix/auth-token-expiry` |

### Workflow

1. Create a feature branch from `develop`:
   ```bash
   git checkout develop
   git checkout -b feature/your-feature
   ```

2. Make changes with clear commit messages

3. Push and create a Pull Request to `develop`:
   ```bash
   git push origin feature/your-feature
   ```

4. Code review by Tech Lead

5. Merge after approval (squash merge preferred)

6. Delete the feature branch

---

## Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

| Type | Usage |
|------|-------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Code style (formatting, semicolons, etc.) |
| `refactor` | Code refactoring |
| `test` | Adding or updating tests |
| `chore` | Build process or auxiliary tool changes |

### Scopes

| Scope | Area |
|-------|------|
| `auth` | Authentication & authorization |
| `menu` | Menu items CRUD |
| `order` | Order placement & management |
| `vendor` | Vendor dashboard & operations |
| `admin` | Admin panel & system config |
| `ui` | Frontend components & styling |
| `api` | Backend routes & middleware |
| `db` | Database schema & migrations |
| `config` | Project configuration |

### Examples

```
feat(auth): implement JWT authentication

- Add login/register endpoints with JWT tokens
- Add auth middleware for protected routes
- Add role-based access control middleware

Closes #12
```

```
fix(order): prevent negative quantity values

Quantity field now validates minimum value of 1
before adding to cart.

Fixes #34
```

```
docs(api): add vendor stats endpoint documentation
```

---

## Pull Request Process

1. **Create feature branch** from `develop`
2. **Make commits** with clear, conventional messages
3. **Push** to GitHub and create a Pull Request
4. **Fill in the PR template**:
   ```
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] feat: New feature
   - [ ] fix: Bug fix
   - [ ] docs: Documentation
   - [ ] refactor: Code restructuring

   ## Testing
   - [ ] Tested locally
   - [ ] All existing tests pass

   ## Related Issues
   Closes #<issue-number>
   ```
5. **Code review** by Tech Lead
6. **Address feedback** with additional commits
7. **Squash merge** after approval
8. **Delete feature branch**

---

## Coding Standards

### JavaScript/React

| Rule | Standard |
|------|----------|
| Indentation | 2 spaces |
| Quotes | Single quotes (JS), double quotes (JSX) |
| Semicolons | Required |
| Line width | 100 characters |
| Components | Functional components with hooks |
| Naming (components) | PascalCase |
| Naming (files) | camelCase |
| Naming (variables) | camelCase |
| Naming (constants) | UPPER_SNAKE_CASE |
| Booleans | Prefix with `is`, `has`, `can`, `should` |
| Props validation | PropTypes |

### Express.js

| Rule | Standard |
|------|----------|
| API design | RESTful principles |
| Request validation | Check required fields, types, and formats |
| Error handling | Centralized error middleware |
| Logging | Console (dev), Winston (prod planned) |
| Configuration | Environment variables via `dotenv` |

### Database

| Rule | Standard |
|------|----------|
| Naming | `snake_case` for tables and columns |
| Primary keys | `id` (INTEGER AUTO_INCREMENT) |
| Foreign keys | Named `referencedTable_column` (e.g., `userId`) |
| Timestamps | `createdAt` as DATETIME |
| Indexing | Index foreign keys and frequently queried columns |

---

## Testing

### Backend Tests

```bash
cd server

# Run all tests
npm test

# Run with coverage
npm run test:coverage
```

Test structure:
```
server/tests/
├── auth.test.js
├── menu.test.js
├── orders.test.js
└── api.test.js
```

### Frontend Tests

```bash
cd client

# Run all tests
npm test

# Run with coverage
npm run test:coverage
```

Test structure:
```
client/tests/
├── components/
├── pages/
└── utils/
```

### What to Test

- **API endpoints**: Status codes, response structure, error cases
- **Auth flows**: Login, register, token expiry, role validation
- **Order lifecycle**: Create, status update, payment, edge cases
- **Frontend rendering**: Page load, empty states, error states
- **Cart operations**: Add, remove, update quantity, persistence

---

## Development Workflow

### Daily Standup

Every **Monday at 10:00 AM (Asia/Dhaka)** in Slack `#general`

Format:
- What I did yesterday
- What I'm doing today
- Blockers

### Code Review Checklist

- [ ] Code follows the project's coding standards
- [ ] No unused imports or variables
- [ ] Error handling is appropriate
- [ ] Security: no hardcoded secrets, SQL injection prevention
- [ ] API responses follow consistent format
- [ ] Frontend handles loading and error states
- [ ] Mobile responsive where applicable
- [ ] No console.log statements in production code

### Pre-Commit Checklist

- [ ] `npm run lint` passes
- [ ] `npm run test` passes
- [ ] `npm run build` succeeds
- [ ] No unused imports or TypeScript errors
- [ ] Feature works as expected in browser

---

## Project Tools

| Tool | Purpose | Location |
|------|---------|----------|
| **Slack** | Team communication | `group7-k8y3821` workspace |
| **Trello** | Task tracking | [NSU Companion Board](https://trello.com/b/LuWzursT/project-management) |
| **Google Calendar** | Milestones & standups | Shared with team |
| **GitHub Actions** | CI/CD | `.github/workflows/ci-cd.yml` |
| **VS Code** | Recommended editor | — |

### Slack Channels

| Channel | Purpose |
|---------|---------|
| `#general` | Daily standups, announcements |
| `#development` | Code discussions, PRs |
| `#design` | UI/UX feedback |
| `#testing` | QA updates, bug reports |
| `#deployment` | DevOps, deployment logs |
| `#announcements` | Milestones, celebrations |

---

## Environment Setup

### VS Code Extensions (Recommended)

- ESLint
- Prettier
- ES7+ React snippets
- SQLite Viewer
- Thunder Client (API testing)

### Editor Settings (`/.vscode/settings.json`)

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.tabSize": 2,
  "files.eol": "\n",
  "javascript.preferences.quoteStyle": "single"
}
```
