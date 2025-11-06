# 🎶 Discography Diary

**Discography Diary** is a personal album collection and ranking application built with React and Node.js. Search Spotify's catalog, rate your favorite albums, and organise them with drag-and-drop rankings.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)
![Spotify API](https://img.shields.io/badge/Spotify-API-1DB954?logo=spotify)

---

## ✨ Features

- 🔍 **Search Albums** - Find albums from Spotify's vast catalog
- ⭐ **Rate & Review** - Give star ratings and add personal notes
- 📊 **Rankings** - Drag-and-drop rankings (overall or by artist)
- 📈 **Statistics** - View insights about your collection (decades, top artists, etc.)
- 💾 **Local Storage** - All data saved in your browser
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

---

## 🛠️ Tech Stack

**Frontend:**
- React 18
- React Router v6
- Vite (build tool)
- CSS3 (Grid & Flexbox)

**Backend:**
- Node.js 18+
- Express.js
- Spotify Web API

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Spotify Developer Account ([Get credentials here](https://developer.spotify.com/dashboard))

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/discography-diary.git
cd discography-diary
```

---

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the `backend` directory:

```env
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
PORT=3001
CLIENT_URL=http://localhost:5173
```

**To get Spotify credentials:**
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Copy your Client ID and Client Secret

Start the backend server:

```bash
npm run dev
```

✅ You should see: `🚀 Server running on http://localhost:3001`

---

### 3. Frontend Setup

Open a **new terminal** and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

*(Optional)* Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:3001
```

Start the frontend development server:

```bash
npm run dev
```

✅ You should see: `Local: http://localhost:5173/`

---

### 4. Open the App

Visit [http://localhost:5173](http://localhost:5173) in your browser.

🎉 **You're all set!** Start searching for albums and building your collection.

---

## 📖 Usage

1. **Search Albums** - Use the search page to find albums from Spotify
2. **Add to Collection** - Click "Add to Collection" on any album
3. **Rate & Review** - Click an album in "My Albums" to rate it and add notes
4. **Create Rankings** - Go to "Rankings" and drag albums to reorder them
5. **View Stats** - Check the "Stats" page to see insights about your collection

---

## 📁 Project Structure

```
discography-diary/
├── backend/
│   ├── server.js          # Express API server
│   ├── package.json
│   ├── .env              # Spotify credentials (gitignored)
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API service layer
│   │   ├── images/       # Static images
│   │   ├── App.jsx       # Main app component
│   │   └── main.jsx      # Entry point
│   ├── package.json
│   ├── .env             # API URL (optional, gitignored)
│   └── .gitignore
│
└── README.md
```

---

## 🎯 Key Features Breakdown

### Album Collection
- Search and add albums from Spotify
- View all albums in a responsive grid
- Sort by date added, rating, year, artist, or name
- Filter by decade
- Delete albums from collection

### Ratings & Notes
- 5-star rating system
- Add personal notes and memories
- Edit ratings and notes anytime

### Rankings
- **Overall Rankings** - Rank all albums together
- **Artist Rankings** - Rank albums within each artist's discography
- Drag-and-drop interface
- Arrow buttons for precise positioning
- Auto-saves rankings

### Statistics
- Total albums count
- Average rating across collection
- Albums by decade breakdown
- Top 5 most-collected artists
- Recently added albums
- Year range of collection

---

## 🔒 Privacy

All data is stored locally in your browser using `localStorage`. No data is sent to any server except Spotify for album searches. Your collection is completely private and portable.

---

## 🤝 Contributing

This is a personal portfolio project, but suggestions are welcome! Feel free to:
- Open an issue for bug reports
- Submit feature requests
- Fork the project for your own use

---

## 📝 License

This project is for educational and portfolio purposes. Not affiliated with or endorsed by Spotify.

---

## 👤 Author

**Your Name**
- GitHub: [@kayley31](https://github.com/kayley31)

---

## 🙏 Acknowledgments

- [Spotify Web API](https://developer.spotify.com/documentation/web-api) for album data
- Album cover images provided by Spotify
- Built using React and Node.js
