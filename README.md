# MediaSearch

> A modern media discovery platform for searching, exploring, downloading, and saving high-quality photos, videos, and GIFs from multiple media sources.

![MediaSearch Preview](./public/preview.png)

## ✨ Overview

MediaSearch is a modern, responsive media discovery application built with React and Redux technology.

The application brings photos, videos, and GIFs from multiple external media APIs into a single, unified search experience. Users can search for visual content, browse results with infinite scrolling, filter results by media type and supported attributes, download media, and save their favorite content to a personal collection.

The UI is designed with a dark, premium aesthetic focused on keeping the media itself at the center of the experience.

---

## 🚀 Features

### 🔎 Smart Media Search

- Search across multiple media sources
- Debounced search-as-you-type
- Search automatically triggers after approximately 500ms of inactivity
- Search suggestions / trending searches
- Clear search functionality
- Loading and error states
- Search result count and current query display

### 🖼️ Photos

- Search high-quality photos
- Photo results from Unsplash and Pexels
- Responsive masonry-style media grid
- Orientation filtering
- Color filtering where supported
- Save photos to collection
- Direct media download

### 🎥 Videos

- Search videos from Pexels
- Dedicated video result cards
- Video indicators
- Responsive video presentation
- Save videos to collection
- Direct download support

### 🎞️ GIFs

- GIF search and discovery
- Giphy integration
- Dedicated GIF indicators
- Responsive GIF cards
- Save GIFs to collection
- Download support where available

### ♾️ Infinite Scrolling

Results load progressively as the user scrolls.

Instead of requiring users to manually navigate through pages:

```text
Search
   ↓
Initial Results
   ↓
Scroll
   ↓
Load More
   ↓
Scroll
   ↓
Load More
   ↓
...

## ✨ All Features

- 🔎 Debounced media search
- 🖼️ Photos — Unsplash & Pexels
- 🎥 Videos — Pexels
- 🎞️ GIFs — Giphy
- ♾️ Infinite scrolling
- 🎛️ Media filters
- 💾 Save to Collection
- ⬇️ Download media
- ⚡ Search result caching
- 📱 Fully responsive modern UI

## 🛠️ Tech Stack

- React
- Redux
- Vite
- JavaScript
- Unsplash API
- Pexels API
- Giphy API

## ⚙️ Setup

```bash
git clone https://github.com/YOUR_USERNAME/media-search-studio.git
cd media-search-studio
npm install
npm run dev
