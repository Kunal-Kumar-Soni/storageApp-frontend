# StorageApp

StorageApp is a web app for keeping files and folders together in one online workspace. You can create an account, organise files into folders, upload and download files, and check how much storage you are using.

This repository contains the **frontend**. It needs a compatible StorageApp backend to handle accounts, file storage, and subscriptions.

## What you can do

- Create an account with email verification, or sign in with email and password or Google.
- Upload files and see upload progress.
- Create folders and browse their contents.
- Rename, download, view details for, and delete files. You can also rename, view details for, and delete folders.
- Check your used and available storage.
- View monthly and yearly storage plans and open the subscription checkout.
- Manage users on the administration page, when your account has permission.

## Get started

### You will need

- [Node.js](https://nodejs.org/) and npm.
- A running StorageApp backend that supports this frontend's API.

### 1. Install the dependencies

In a terminal, go to this project folder and run:

```bash
npm ci
```

### 2. Configure the app

Create a file named `.env.local` in the project folder and add the settings below:

```env
VITE_BACKEND_BASE_URL=http://localhost:YOUR_BACKEND_PORT
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id
VITE_RAZORPAY_KEY=your-razorpay-public-key-id
```

Replace the example values with your own:

| Setting | What it is for |
| --- | --- |
| `VITE_BACKEND_BASE_URL` | The base URL of the running backend API. |
| `VITE_GOOGLE_CLIENT_ID` | The Google OAuth client ID used by Google sign-in. |
| `VITE_RAZORPAY_KEY` | The Razorpay public key ID used to open subscription checkout. |

The backend URL and Google client ID are needed for the app's main features and Google sign-in, respectively. Razorpay settings are only needed if you want to use subscription checkout. Ask the person who runs your backend for the correct values and setup instructions.

Values with the `VITE_` prefix are included in the browser app. **Do not put passwords, private API keys, or the Razorpay secret key in this file.** The backend must be configured separately, including any required CORS and cookie settings.

### 3. Start the app

```bash
npm run dev
```

Open the local URL printed in your terminal. Keep the backend running while you use the app.

## Other commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the local development server. |
| `npm run build` | Builds the app for deployment. The output is saved in `dist/`. |
| `npm run preview` | Serves the built app locally so you can check it. Run the build first. |
| `npm run lint` | Checks the project files with ESLint. |
| `npm test` | Runs the current placeholder test script; it does not yet test app features. |

## Pages

| Page | What it is for |
| --- | --- |
| `/` | Welcome page. |
| `/register` | Create an account. |
| `/login` | Sign in. |
| `/drive` | Open the top-level storage folder. |
| `/directory/:dirId` | Open a folder by its ID. |
| `/plans` | View storage plans and subscription options. |
| `/users` | User administration; access depends on your account permissions. |

## Project layout

```text
src/
  api/          Requests to the backend
  components/   Reusable interface pieces
  context/      Shared folder and file actions
  hooks/        Reusable React hooks
  App.jsx       Page routes
  DirectoryView.jsx
  Home.jsx
  Login.jsx
  Plans.jsx
  Register.jsx
  UsersPage.jsx
utils/
  formatSize.js
public/         Static files and hosting settings
```

## Backend and deployment notes

The frontend calls the backend for account actions, folder and file operations, storage usage, and subscription details. File uploads use a backend-issued upload URL, so the backend and its file storage service must also be configured.

For deployment, build the app with `npm run build` and publish the `dist/` folder to a static web host. Configure the production environment variables for that host, and ensure it serves `index.html` for app routes. The included `public/_redirects` file provides this fallback on hosts that support the Netlify redirects format.
