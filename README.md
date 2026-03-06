# All-in Events CRM

A full-featured Customer Relationship Management system for All-in Events, built with React and Firebase.

## Features

- 🔐 **Firebase Authentication** — Admin-only access
- 📊 **Analytics Dashboard** — Live stats, charts, conversion rates, pipeline value
- 👥 **Clients** — Full contact management with status tracking
- 📅 **Bookings** — Event bookings with budget, deposit tracking, and pipeline view
- 🎉 **Events/Services** — Manage service packages shown on your website
- 💬 **Engagements** — Track contact form leads with follow-up dates
- ⭐ **Reviews** — Manage and moderate customer reviews
- 📝 **Notes** — Internal notes and reminders with priority levels
- ☁️ **Firebase Hosting** — Deploy in minutes

---

## Setup Instructions

### Step 1 — Install dependencies

```bash
npm install
```

### Step 2 — Create your Firebase project

1. Go to https://console.firebase.google.com
2. Click **Add Project** → name it `allinevents-crm`
3. In your project:
   - **Firestore Database** → Create database → Start in test mode
   - **Authentication** → Get started → Enable Email/Password provider
   - **Hosting** → Get started

### Step 3 — Get your Firebase config

1. Firebase Console → Project Settings (gear icon) → Your Apps
2. Click **Add App** → Web → register with a nickname
3. Copy the `firebaseConfig` object

### Step 4 — Paste your config

Open `src/firebase.js` and replace the placeholder values:

```js
const firebaseConfig = {
  apiKey:            "YOUR_ACTUAL_API_KEY",
  authDomain:        "your-project.firebaseapp.com",
  projectId:         "your-project-id",
  storageBucket:     "your-project.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID"
};
```

### Step 5 — Create your admin user

Firebase Console → Authentication → Users → **Add User**
- Enter an email and password
- This is what you'll use to log in to the CRM

### Step 6 — Set Firestore Security Rules

Firebase Console → Firestore → Rules → Replace with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Click **Publish**.

### Step 7 — Update .firebaserc

Open `.firebaserc` and replace `YOUR_FIREBASE_PROJECT_ID` with your actual project ID.

### Step 8 — Install Firebase CLI and login

```bash
npm install -g firebase-tools
firebase login
```

### Step 9 — Build and deploy

```bash
npm run build
firebase deploy
```

Your CRM will be live at: `https://YOUR_PROJECT_ID.web.app`

---

## Local Development

```bash
npm start
```

Opens at http://localhost:3000

---

## Project Structure

```
src/
├── firebase.js              # Firebase config (edit this!)
├── App.js                   # Root router
├── index.js                 # Entry point
├── index.css                # Global styles
├── utils/
│   ├── firestore.js         # Firestore CRUD helpers
│   └── helpers.js           # Formatting & color utilities
├── components/
│   ├── UI.js                # Shared UI components
│   └── Sidebar.js           # Navigation sidebar
└── pages/
    ├── CRM.js               # Main CRM shell + auth gate
    ├── LoginPage.js         # Login screen
    ├── Dashboard.js         # Analytics dashboard
    ├── Clients.js           # Clients management
    ├── Bookings.js          # Bookings management
    └── Sections.js          # Events, Engagements, Reviews, Notes
```

---

## Firestore Collections

| Collection    | Fields |
|---------------|--------|
| `clients`     | fullname, email, phone, county, company, address, eventType, source, status, notes |
| `bookings`    | fullname, email, phone, county, eventname, eventdate, eventtype, venue, guestcount, budget, depositPaid, depositAmount, status, assignedTo, notes |
| `events`      | eventname, description, services, image_url, category, price, capacity, location, status, featured |
| `engagements` | fullname, email, phone, comment, source, priority, status, followUpDate, assignedTo |
| `reviews`     | fullname, email, review, rating, eventType, status |
| `notes`       | title, content, priority, category, dueDate |

All collections also include `createdAt` and `updatedAt` timestamps (set automatically).

---

## Deploying Updates

Anytime you make changes:

```bash
npm run deploy
```

This runs `npm run build && firebase deploy` in one command.

---

## Support

Built for All-in Events, Nairobi Kenya.
