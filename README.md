## Welcome to the **Book App**!

Application for managing your personal library and traking your reading progress. This project is built with **React** and **Next.js**, leveraging **TypeScript** for type safety, **Tailwind CSS** for streamlined styling, and **Zustand** for state management. This README provides an overview of the project, its features, and the technologies used.

---

### 🚀 Features

#### **Public Pages**

- **Registration Page:** Create a new account with a validated form (Name, Email, Password). Errors are handled and displayed via notifications. Upon successful registration, users are automatically logged in and redirected to the **Recommended Page**.
- **Login Page:** Access your account with a validated form (Email, Password). Authentication errors trigger notifications. Successful login redirects to the **Recommended Page**.

#### **Authenticated User Pages**

- **Main Layout:** A persistent header across all private pages, featuring a company logo, user navigation (`NavigationBar`),
- **User Navigation (`NavigationBar`):** Includes links to the `Recommended` and `My Library` pages. It's a responsive **burger menu** on mobile and tablet.
- **Logout:** A dedicated button that sends a request to the backend to end the active session. The user is then logged out on the client-side and redirected to the **Login Page**.

---

### **Recommended Page (`/recommended`)**

This page helps users discover new books.

- **Dashboard:** A reusable component that contains:
  - **Filters:** A form with two inputs for finding recommended books.
  - **Library Link:** A brief description of the app's functionality with a link to the **My Library** page.
  - **Quote:** A static quote section.
- **Recommended Books:**
  - **Server-Side Pagination:** The page uses server-side pagination with "next" and "previous" arrows to navigate through the book list.
  - **Book Cards:** Displays a list of book cards, each with a cover image, title, and author. Clicking on a card opens a modal with detailed information and an **"Add to library"** button.

---

### **My Library Page (`/library`)**

This is your personal book collection.

- **Dashboard:** A reusable component that contains:
  - **Add Book Form:** A form for adding a new book to your library. Form fields are validated, and a success modal appears upon a successful server response.
  - **Recommended Books Link:** A block with a list of recommended books and a link to the `Recommended` page.
- **My Library Books:**
  - **Reading Status Filter:** A dropdown menu to filter books by their reading status.
  - **Book Cards:** Displays a list of books from your library. Each card has a cover image, title, author, and a button to **delete** the book. Clicking the cover opens a modal with book details and a **"Start reading"** button.

---

### **Reading Page (`/reading`)**

Track your reading progress here.

- **Dashboard:** A reusable component that contains:
  - **Add Reading Form:** A form with one input and a "To start" or "To stop" button to log reading sessions.
  - **"To Start":** Sends a request to the backend to log the starting page number. The book's status is then updated to "in progress".
  - **"To Stop":** Sends a request to log the ending page number. Server-side calculations for reading speed are then displayed. If the book is finished, a success modal is shown.
  - **Details:** Displays reading information in either a `Diary` or `Statistics` format.
    - **Diary:** Tracks reading events by date, including pages read, time, and percentage completion. It also includes a button to delete a reading event.
    - **Statistics:** A graphical representation of your reading progress.

---

### 🛠️ Technology Stack

- **Frontend:**
  - **React:** A JavaScript library for building user interfaces.
  - **Next.js:** A React framework for building server-side rendered and static websites.
  - **TypeScript:** A strongly typed programming language that builds on JavaScript.
  - **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
  - **Zustand:** A small, fast, and scalable state-management solution.
  - **react-hook-form + Yup:** Libraries for form validation.
  - **EmblaCarousel:** Used for building a flexible and touch-friendly carousel.
  - **react-toastify:** A library for creating customizable and responsive toast notifications.
  - **@artsy/fresnel:** Provides a simple way to create responsive components based on breakpoints.
- **Backend:**
  - **API Documentation:** The project uses an external backend API. You can find the documentation here: [https://readjourney.b.goit.study/api-docs/](https://readjourney.b.goit.study/api-docs/).

---

### 📦 Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone [your-repo-link]
    cd [your-repo-name]
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

4.  **View the live application:**
    The application is deployed on Vercel and can be accessed here:

    [https://weather-app-two-dun-70.vercel.app/](https://weather-app-two-dun-70.vercel.app/)
