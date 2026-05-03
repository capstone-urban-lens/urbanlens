# 🌆 Urban Lens

## 📌 Project Overview

Urban Lens is a web application that allows users to explore, compare, and understand the cost of living across different cities. The project presents city-level data in a clear, visual, and accessible way to help users make informed decisions about where they might want to live, work, or travel.

Users can browse cities, view detailed cost-of-living breakdowns, and compare cities side-by-side to see how they stack up across key metrics.

---

## 🎯 Purpose & Motivation

This project was developed as our **capstone project** for our senior year as Digital Media students at UCF. It demonstrates our ability to design and build a full-stack web application using modern tools and best practices.

Our goals with this project were to:

- Apply real-world software development workflows (planning, collaboration, version control)
- Build a scalable and maintainable full-stack application
- Practice accessibility-first and user-centered design
- Gain experience deploying and hosting a production-ready application

---

## 🛠 Tech Stack

### Frontend

- **React** – component-based UI development
- **MaterialUI – responsive layout and styling**

### Backend / Database

- **Supabase** – backend-as-a-service (database, APIs)

### Deployment & Hosting

- **Vercel** – frontend hosting and deployment
- **GitHub** – version control and collaboration
- **Docker** - local hosting and consistent dev environment 

---

## ✨ Features

- Browse a list populated with real data from 100 cities with key statistics and summaries
- View detailed city pages with structured data
- Compare cities side-by-side
- Read comments on cities
- Create an account, allowing the user to save cities for later and upload comments
- Responsive design for desktop and mobile
- Accessibility-conscious UI (semantic HTML, keyboard navigation, screen reader support)

---

### 📄 Diagrams

## Server-Side Architecture
![Server-Side Architecture](/src/assets/diagrams/server-side-architecture.png)

## Supabase Database Schema
![Database Schema](/src/assets/diagrams/database-schema.png)

## API Diagram
![API Diagram](/src/assets/diagrams/api.png)


## 👥 Team Contributions

> Each team member contributed to different aspects of the project. Responsibilities included but were not limited to:

- **Meera Bhola –** Lead Developer
- **Caroline Abbey** – Project Manager
- **Lorian Rodriguez** – Lead UX Designer and Tester
- **Tybee Stewart** – Lead Researcher
- **Qinxin Wang** – Lead UI Designer



---

## 🚀 Live Demo

🔗 **Vercel Deployment:**\
[https://www.urbanlens.pro/](https://www.urbanlens.pro/) 

---

## 🧪 Running the Project Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/capstone-urban-lens/urbanlens.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Option 2: Running with Docker

This project also supports running the frontend using **Docker**, allowing for a consistent development environment without needing to install dependencies directly on your machine.

#### Prerequisites
- Docker installed on your system

#### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/capstone-urban-lens/urbanlens.git
   ```
2. Navigate to the project directory:
   ```bash
   cd urbanlens
   ```

3. Create .env file using variables defined in .env.example and values provided (via Canvas)

4. Start the application using Docker Compose:
   ```bash
   docker compose up --build
   ```

Once running, the application will be available at `http://localhost:8080`.

Alternatively, you can build and run the image manually:
```bash
docker build -t urban-lens .
docker run -p 8080:3000 urban-lens
```

---

## 📖 Future Improvements

- Ability to save/favorite cities
- Implement city filtering
- Performance optimizations

---

## 📝 License

This project was created for educational purposes as part of a capstone course at UCF for the Digital Media BA under the Web & Social Platforms Track.

---

## 🙌 Acknowledgements

Special thanks to our instructors, mentors, and classmates for guidance and feedback throughout the development process.
