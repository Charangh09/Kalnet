# Explain My Plan – AI Clarity and Structuring Tool

## Project Overview

Many people have useful ideas but struggle to turn them into clear, executable plans. Most plans start as vague thoughts without defined steps, timelines, or required resources. This project solves that problem by taking raw user input and converting it into a structured plan that is easier to understand and act on.

Explain My Plan is a full-stack web application that accepts a natural language idea, analyzes it with an LLM, and returns a practical output that includes structure, gaps, action steps, and a clarity score. The goal is to help users move from intention to execution with better clarity.

## Features

The application analyzes free-form ideas and breaks them into a clear structure with goal, method, steps, and timeline. This gives users an immediate view of what they are trying to do and how they might do it.

It also detects missing elements in the plan. Instead of only marking things as missing, the app highlights gaps in goal clarity, execution steps, resources, and timeline, then gives practical guidance for improvement.

To improve readability, the app generates a simplified version of the original input. This helps users restate their idea in a clearer and more focused way.

The output includes actionable next steps designed to be practical and implementation-oriented. These steps are intended to help users start execution quickly rather than stay in planning mode.

A clarity score from 0 to 100 is included to make plan quality measurable. The score is explained with a transparent breakdown so users can see where they are strong and where they need improvement.

The app supports iteration by allowing users to edit the original input and run analysis again. This helps users compare results and improve their plan quality over time.

## Tech Stack

The frontend is built with React and Tailwind CSS to provide a clean, responsive dashboard interface.
The backend is built with Node.js and Express and exposes a REST endpoint for plan analysis.
AI analysis is handled through Gemini API integration, with support for structured prompting and safe response parsing.
MongoDB is optional and can be used for storing user input, analysis output, and timestamps.

## Setup Instructions

### Clone the repository

```bash
git clone https://github.com/Charangh09/Kalnet.git
cd Kalnet
```

### Run the backend

```bash
cd server
npm install
```

Create a `.env` file in the `server` folder based on `.env.example`, then set values like:

```env
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
GEMINI_API_KEY=your_api_key
GEMINI_MODEL=gemini-2.0-flash
MONGODB_URI=your_mongodb_uri_optional
```

Start backend:

```bash
npm run dev
```

### Run the frontend

Open a new terminal:

```bash
cd client
npm install
```

Create `.env` in `client` based on `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Start frontend:

```bash
npm run dev
```

## AI Prompt Design

The prompt design uses a strict structured format so the model returns predictable JSON output. The prompt defines the assistant role, the exact schema, and output rules, including practical constraints such as domain-relevant actions and avoiding generic advice.

This structure improves consistency and reduces malformed responses. The backend also applies normalization and validation to ensure the final response is reliable for frontend rendering.

## Clarity Score Logic

The clarity score is calculated out of 100 using four equal components. A clear goal contributes 25 points, defined steps contribute 25 points, timeline presence contributes 25 points, and overall completeness contributes 25 points. The final score is the total of these components, and the breakdown is shown to the user for transparency.

## Project Structure

The project is split into two main folders: `client` and `server`. The `client` folder contains the React application, reusable UI components, API integration logic, and styling. The `server` folder contains Express routes, controllers, AI service logic, formatting and scoring utilities, and optional MongoDB models/configuration.

## Challenges Faced

One major challenge was obtaining consistently structured output from the LLM, especially when user input was vague. Another challenge was reducing generic responses and making generated steps more practical and domain-aware. Designing a score that is simple, understandable, and still useful was also important, since the score needs to guide users without being confusing.

## Approach to AI Prompting

The prompting approach was schema-first. The model is instructed to produce strict JSON only, with clearly defined keys and practical response rules. Prompt constraints were designed to encourage specificity, avoid abstract advice, and provide actionable suggestions tied to the user’s context. This was paired with backend-side parsing and fallback handling to keep responses stable.

## Future Improvements

Future improvements include adding user authentication and plan history tracking, introducing export options such as PDF or share links, improving domain-specific templates for different use cases, and adding deeper analytics to visualize clarity improvements over multiple iterations.

## Live Demo

Live demo link: Coming soon

## GitHub Repository

https://github.com/Charangh09

## Author

Sri Charan Sirikonda
B.E. Artificial Intelligence and Data Science

## Conclusion

This project demonstrates practical full-stack development, applied prompt engineering, and product-focused UX thinking. It shows how AI can be used not just to generate text, but to improve decision quality by converting unclear ideas into structured, actionable plans.
