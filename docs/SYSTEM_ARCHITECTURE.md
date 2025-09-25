# EduTrack System Architecture

This document outlines the system architecture for the EduTrack application.

## 1. Core Technology Stack

The application is built on a modern, serverless-focused technology stack:

-   **Framework**: [Next.js 15](https://nextjs.org/) (using the App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **UI Library**: [React](https://react.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
-   **Generative AI**: [Genkit](https://firebase.google.com/docs/genkit) (powered by Google AI)

## 2. Project Structure

The project follows a standard Next.js App Router structure with clear separation of concerns.

-   `src/app/`: This is the core of the application, containing all routes and pages.
    -   `src/app/(role)/`: Role-based routes are organized into directories like `student/`, `professor/`, `college-admin/`, etc. Each of these contains the specific pages and a `layout.tsx` file that provides the nested sidebar navigation for that role.
    -   `src/app/page.tsx`: The main landing page.
    -   `src/app/globals.css`: Contains the global styles and Tailwind CSS directives, including the application's color theme defined with CSS variables.
    -   `src/app/layout.tsx`: The root layout for the entire application.

-   `src/components/`: Contains reusable React components used across the application.
    -   `src/components/ui/`: Auto-generated ShadCN UI components (e.g., `Button`, `Card`).
    -   `src/components/auth/`: Components related to authentication, like login and registration forms.
    -   `src/components/landing/`: Components specific to the main landing page (Hero, Features, etc.).
    -   `src/components/layout/`: Shared layout components like the `Header` and `Footer`.

-   `src/ai/`: Contains all Artificial Intelligence-related logic.
    -   `src/ai/genkit.ts`: Initializes and configures the Genkit AI instance.
    -   `src/ai/flows/`: Holds the Genkit flows that define the application's AI capabilities, such as `personalized-task-suggestions.ts`.

-   `src/lib/`: Contains utility functions, constants, and type definitions.

-   `public/`: For static assets like images and fonts.

## 3. Routing and Layouts

-   **Routing**: The application uses the **Next.js App Router**. Routes are defined by the folder structure within `src/app`.
-   **Role-Based Access**: Access to different parts of the application is segmented by user role. This is achieved by grouping routes into directories (e.g., `/student/dashboard`, `/professor/dashboard`). Each role has its own dedicated layout with a unique sidebar menu.
-   **Layouts**: The root layout (`src/app/layout.tsx`) defines the main HTML structure. Each user role then has its own nested layout (e.g., `src/app/student/layout.tsx`) that wraps all pages for that role, providing a consistent sidebar and header.

## 4. Styling and UI

-   **Styling Engine**: **Tailwind CSS** is used for all styling, following a utility-first approach.
-   **Component Library**: The app uses **ShadCN UI**, which provides a set of accessible and unstyled components that are then styled with Tailwind CSS. The theme colors are configured in `src/app/globals.css` using HSL CSS variables, making it easy to change the color scheme.
-   **Fonts**: The application uses 'PT Sans' for both body and headline text, configured in `src/app/layout.tsx` and `tailwind.config.ts`.

## 5. AI Functionality

-   **AI Framework**: **Genkit** is used to orchestrate calls to Large Language Models (LLMs). The configuration is centralized in `src/ai/genkit.ts`.
-   **Flows**: Specific AI features are implemented as Genkit "flows." For example, the `personalized-task-suggestions` flow in `src/ai/flows/` defines the logic for taking student data as input and generating tailored task suggestions using an AI model. This makes the AI logic modular and easy to manage.

## 6. Future-Proofing (Potential Integrations)

-   **Database and Authentication**: The architecture is prepared for integration with **Firebase**. This would typically involve adding Firebase configuration files and using Firebase SDKs for services like Firestore (for database) and Firebase Authentication (for user management), but this has not yet been implemented.
