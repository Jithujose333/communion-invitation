# Felix & Festin's First Holy Communion Invitation

A premium, visually stunning web invitation for the First Holy Communion of twins Felix & Festin. 

## Features
- **3D Opening Envelope**: Starts with a closed pastel-blue envelope with a custom gold wax seal monogrammed with `F&F`.
- **Pigeon Flight Animation**: Two high-contrast golden-outlined white doves carrying olive branches fly out and off the screen as the invitation unfolds.
- **Embedded Song**: Play a beautiful communion hymn in the background with a floating play/pause control button (featuring rotation transitions).
- **Interactive Details**: Event timings, a countdown timer to August 15, 2026, and Google Maps direction links to Christ King Church, Annamanada.
- **Responsive Layout**: Tailored for both mobile screens and desktops.

---

## How to Run on Localhost

Follow these steps to run the application on your computer:

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (version 18 or above recommended).

### 2. Install Dependencies
Open your terminal in the project's root folder and run:

```bash
# Install concurrently in the root folder
npm install

# Install backend dependencies
npm install --prefix backend

# Install frontend dependencies
npm install --prefix frontend
```

### 3. Run the Development Server
You have three easy options to start the application:

* **Option A (Windows Shortcut)**: Double-click the `run-dev.bat` file in the root folder.
* **Option B (PowerShell)**: Execute `./run-dev.ps1` in your terminal.
* **Option C (Command Line)**: Run this command in your root directory terminal:
  ```bash
  npm run dev
  ```

Once started, open your web browser and navigate to:
- **Frontend**: [http://localhost:3000/](http://localhost:3000/)
- **Backend API**: [http://localhost:5000/](http://localhost:5000/)

---

## Folder Structure
- `/frontend`: Vite + React UI, custom components (Envelope, InvitationCard, PigeonFlight, BackgroundMusic), and CSS variables.
- `/backend`: Node.js + Express API server (handles RSVP requests if enabled).
