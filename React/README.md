# Momo's Regular Expedition

A turn-based RPG game inspired by Undertale and Pokemon, built with **Spring Boot** (backend) and **React** (frontend).

![Game Screenshot](screenshot.png)

## Features

- 🎮 **3 Save Slots** - Hollow Knight-style save slot selection
- ⚔️ **Turn-based Combat** - Undertale-inspired attack timing mechanic
- 🏰 **13 Rooms/Levels** - Progressive difficulty with bosses
- 🛒 **Shop System** - Weapons, Defense, Potions, Charms, Trading
- 💎 **Orb Upgrade System** - Upgrade Health, Attack, Crit Rate
- 🎯 **Attack Timing Meter** - Hit the center for 5x damage!
- ⚙️ **Custom Key Bindings** - WASD + Space by default
- 🔧 **Dev Mode** - Edit enemies, items, rewards, and configs
- 💾 **MySQL Database** - Persistent game progress

## Tech Stack

### Backend
- Spring Boot 3.2.5
- Spring Data JPA
- MySQL 8.0
- Lombok

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Icons

## Quick Start

### 1. Database Setup

```sql
CREATE DATABASE momo_regular_expedition;
```

### 2. Start Backend

```bash
cd backend
# Update application.properties with your MySQL credentials
./mvnw spring-boot:run
```

Backend runs at: `http://localhost:8080`

### 3. Start Frontend (Development)

```bash
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

## Game Controls

| Key | Action |
|-----|--------|
| W | Move Up |
| S | Move Down |
| A | Move Left |
| D | Move Right |
| Space | Select / Attack |

*Controls can be customized in Settings*

## Dev Mode Access

- Click the gear icon in the top-right corner of the main menu
- **Username:** `Momo Joestar`
- **Password:** `123456789`

## Game Mechanics

### Attack Timing Meter
```
[/5][/3][1x][1.2x][1.7x][3x][5x][3x][1.7x][1.2x][1x][/3][/5]
     ←——— A line sweeps left to right ———→
     Hit SPACE when the line is in the center for max damage!
```

### Room Difficulty

| Room | Type | Notes |
|------|------|-------|
| 1-2 | Easy | Learning the basics |
| 3-6 | Medium | Enemies gain crit chance |
| 7-10 | Boss | High HP, high attack |
| 11-13 | Final | Only beatable with good timing |

### Hard Mode
- Available after completing all 13 rooms
- Enemy HP and Attack x2
- Same rewards

## Project Structure

```
momo-regular-expedition/
├── backend/                 # Spring Boot backend
│   ├── src/main/java/      # Java source files
│   └── src/main/resources/ # Configuration
├── src/                    # React frontend
│   ├── auth/              # Dev login components
│   ├── components/        # Game UI components
│   ├── context/           # React context (game state)
│   ├── services/          # API service layer
│   └── types/             # TypeScript types
├── public/                 # Static assets
└── index.html             # Entry point
```

## API Documentation

See [backend/README.md](backend/README.md) for full API documentation.

## License

MIT License - feel free to use this project for learning!

---

*Made with ❤️ by Momo Joestar*
