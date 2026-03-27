# 🎮 AI-Based Hide and Seek Game

🔗 **GitHub Repository**
https://github.com/RAR2025/AI-Based-Hide-and-Seek-Game.git

---

## 📌 Overview

This project is a grid-based AI game where a player tries to avoid being caught by an intelligent AI agent. The AI uses the **A* (A-Star) search algorithm** to find the optimal path and dynamically chase the player when visible.

The game demonstrates core Artificial Intelligence concepts such as **intelligent agents, environment modeling, and informed search algorithms** in an interactive way.

---

## 🚀 Features

* 🎮 Interactive grid-based gameplay
* 🧠 AI agent with intelligent decision-making
* 🔍 A* pathfinding algorithm for optimal movement
* 👁️ Line-of-sight detection system
* 🔄 Dual AI behavior:

  * **Chase Mode** (when player is visible)
  * **Patrol Mode** (random movement when not visible)
* 💀 Game Over popup UI
* 🔁 Restart button (no page reload)

---

## 🧠 AI Concepts Used

### Intelligent Agent

* Perception → Detects player within visibility
* Decision → Chooses between chase or patrol
* Action → Moves within the environment

### Environment Type

* Partially Observable
* Deterministic
* Discrete

### A* Search Algorithm

The AI uses A* to compute the shortest path efficiently.

**Formula:**

```
f(n) = g(n) + h(n)
```

Where:

* `g(n)` = cost from start node
* `h(n)` = heuristic (Manhattan distance)

---

## 🎯 How It Works

1. Player moves using arrow keys
2. AI checks visibility (same row/column, no obstacles)
3. If visible → AI uses A* to chase
4. If not visible → AI patrols randomly
5. If AI reaches player → Game Over

---

## 🛠️ Tech Stack

* **HTML** → Structure
* **CSS** → Styling
* **JavaScript** → Game logic + AI

---

## ▶️ How to Run

1. Download or clone the repository
2. Open `index.html` in your browser
3. Use arrow keys to move
4. Avoid getting caught by the AI

---

## 📂 Project Structure

```
├── index.html
├── README.md
```

---

## ⚡ Future Improvements

* Multiple AI agents
* Difficulty levels
* Fog of war system
* Score tracking
* Advanced AI (learning-based behavior)

---

## 📸 Demo Idea (Optional)

You can add screenshots or a screen recording here to showcase gameplay.

---

## 📚 Learning Outcomes

* Understanding of A* search algorithm
* Implementation of intelligent agents
* Real-time decision-making systems
* Basics of game development using JavaScript

---

## 🧾 License

This project is for educational purposes.

---

## 🙌 Author

Developed as part of an Artificial Intelligence mini project.
