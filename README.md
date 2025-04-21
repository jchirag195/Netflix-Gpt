# Netflix-GPT

- Created React App with Vite
- Configured Tailwind CSS
- Header
- Routing of App
- Login Form
- Sign Up Form
- Form Validation
- useRef Hook
- Firebase Setup
- Deploying our App to Production
- Create SignUp User Account
- Implement SignIn user API
- Created Redux store with userSlice
- Implemented Signout Feature
- Update Profile
- BugFix: Sign Up user DisplayName and profile picture update
- BugFix: If the user is not logged in, redirect `/browse` to the login page and vice-versa 
- Unsubscribed to the `onAuthStateChanged` callback
- Add HardCoded values to the constant files
- Register for TMDB API and create an app over there and get Access Token
- Get Data from TMDB Now Playing Movies list API
- Custom Hook for NowPlayingMovies
- Created a `movieSlice`
- Update store with movies data
- Planning for mainContainer and secondaryContainer
- Fetch data for trailer video
- Update store with trailer video data
- Embedded the YouTube video and make it autoplay and mute on render
- Tailwind classes to make `mainContainer` awesome
- Build Secondary Components
- Build `MovieList`
- Build `MovieCard`
- TMDB Image CDN URL
- Made the browse look amazing with Tailwind CSS
- Different Custom Hooks
- GPT Search Page
- GPT Search Bar
- (BONUS) Multi-Language Feature in our App
- Integrate Open APIs (Getting OpenAI Key)
- GPT Search API call
- Fetched GPT movie suggestions from TMDB 
- GPT Slice added data over there
- Reused `MovieList` Component to make movie suggestion container
- Memoization
- Adding `.env` file to `.gitignore`
- Made our app responsive

---

## Features

### Login/SignUp
- Sign In / Sign Up Form
- Redirect to Browse Page upon successful login

### Browse (after authentication)
- Header
- Main Movie
  - Trailer in Background
  - Title & Description
  - Movie Suggestions
    - Movie List * N

### Netflix-GPT
- Search Bar
- Movie Suggestion

---

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js**
- **npm** or **yarn**

---

## Getting Started

Follow these steps to set up and run GPTFLIX locally:

### Clone the Repository:

```bash
git clone https://github.com/jchirag195/Netflix-Gpt

Navigate to the Project Directory:
bash
Copy
Edit
cd GPTFLIX

Install Dependencies:
Using npm:

bash
Copy
Edit
npm install
Or using yarn:

bash
Copy
Edit
yarn install

Set Up Environment Variables:
Create a .env file in the root directory and add the following variables:

env
Copy
Edit
VITE_QWEN_KEY=your_qwen_api_key
VITE_TMDB_KEY=your_tmdb_api_key
VITE_FIREBASE_KEY=your_firebase_api_key
Replace your_qwen_api_key, your_tmdb_api_key, and your_firebase_api_key with your actual API keys.

Configure Firebase:
Create a src/utils/firebase.js file and add your Firebase configuration:

js
Copy
Edit
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_KEY,
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);

export default app;
Replace your-project-id, your-messaging-sender-id, and your-app-id with your actual Firebase configuration values.

Start the Development Server:
Using npm:

bash
Copy
Edit
npm run dev
Or using yarn:

bash
Copy
Edit
yarn dev
The application will be running at http://localhost:3000 by default.

Building for Production
To create a production build:

Using npm:

bash
Copy
Edit
npm run build
Or using yarn:

bash
Copy
Edit
yarn build
The optimized files will be in the dist directory.

Deployment
GPTFLIX can be deployed using various platforms that support static sites, such as Vercel, Netlify, or Firebase Hosting. Ensure that your environment variables are correctly set up in your deployment platform.

Acknowledgments
React

Tailwind CSS

The Movie Database (TMDB) API

OpenRouter API

Qwen API

Firebase