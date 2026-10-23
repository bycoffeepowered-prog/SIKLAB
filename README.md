# SIKLAB

A Philippine history adventure game made to make learning more engaging for young learners. A mysterious glitch pulls a student from Dasmariñas into the nation's past, and players explore each era through story, street games and AR.

**Live site:** https://larongsiklab.com

![SIKLAB home page](docs/home.png)
![Review Art Wall](docs/review-art-wall.png)

## About the project

SIKLAB is our capstone project, built for Grade 6 learners. This repository is the project's main website, the home of the game. A separate admin dashboard, [SIKLAB-Admin](https://github.com/bycoffeepowered-prog/SIKLAB-Admin), connects to the same backend.

<!-- If the Unity game or the research paper lives in another repo, link it here. -->

## What's on the site

- The story and the eras of Philippine history the game covers
- Street games, including Tumbang Preso- and Jackstone-inspired mini-games
- AR features
- **The Review Art Wall.** Instead of only writing feedback, young players can draw their thoughts about the game, inspired by drawing in MS Paint as a kid
- An old-school arcade look and feel

## Tech

- React + Vite
- Supabase (database and backend, shared with the admin dashboard)
- Deployed on Vercel

## My role

I was the **Project Manager**. I coordinated the team and the development process, designed the website UI, built the main website and admin dashboard in React with Supabase, and contributed selected gameplay features in Unity.

## Team

Powered by Coffee

<!-- Add teammates' names and roles here. -->

## Run it locally

```bash
git clone https://github.com/bycoffeepowered-prog/SIKLAB.git
cd SIKLAB
npm install
npm run dev
```

Create a `.env` file with your own Supabase project's URL and public (anon) key. <!-- Check the exact variable names in the code (search for import.meta.env) and write them here. -->

Never commit your `.env` file, and never put a Supabase service-role key in this project.

## Links

- Live site: https://larongsiklab.com
- Admin dashboard: https://siklab-admin.vercel.app
- Team YouTube channel: https://www.youtube.com/@PoweredByCoffee-CMNW
