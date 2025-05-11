# Redditime

An open-source reddit marketing tool.

## What is Redditime

Redditime is a tool that helps you with growing you product on reddit.

## Why Redditime

Most reddit marketing tools are expensive and closed-source. Redditime is taking different approach:

- 🔓 Open-Source - You can see how redditime works
- ⏰ Post scheduling - You can schedule your post for max engagement and views
- 🛡️ Private - No tracking, no selling. Even database is available only locally
- 🫶 Easy to use - Intuitive UI

## Tech Stack

Redditime is built with modern technologies:

- Frontend: Nextjs, TailwindCSS, shadcn/ui, motion
- Backend: Honojs, Better-Auth, drizzle, resend, react-email, sqlite
- Database: sqlite
- Authentication: Reddit OAuth

## Getting Started

### Setup

1. **Clone and Install**:

```
# Clone the repo
git clone https://github.com/jacob-brn/Redditime-Reddit-Marketing-Tool
cd Redditime-Reddit-Marketing-Tool

# Install frontend dependencies
cd frontend
npm install --force

# Install backend dependencies
cd ..
cd api
npm install
```

2. **Setup Enviroment Variables**

- Copy `.env.example` to `env.local`
- Configure your env variables (See below)

3. **Start the app**
   First terminal (at root of the project):

```
cd frontend
npm run dev
```

Second terminal (at root of the project):

```
cd api
npm run start
```

4. **Applying migrations** (For correct database functionality)
   Terminal at Redditime-Reddit-Marketing-Tool/api

```
npm run db:generate
npm run db:migrate
```

5. **Restarting backend**

```
npm run start
```
