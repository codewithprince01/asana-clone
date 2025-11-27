# Asana-style Task Board (Full Stack)

A simple Asana-style kanban board built with **Node.js/Express + MongoDB (Mongoose)** on the backend and **React (Vite)** on the frontend.

- Boards with tasks grouped by status ("To Do", "In Progress", "Done").
- Create/edit/delete tasks, update status, and manage multiple boards.
- Frontend and backend follow the exact API contracts described in the task.

---

## Project structure

```text
Asana-clone/
  backend/
    config/db.js
    models/Board.js
    models/Task.js
    routes/boards.js
    routes/tasks.js
    seed/seed.js
    .env.example
    package.json
    server.js
  frontend/
    index.html
    package.json
    vite.config.js
    src/
      api/api.js
      context/BoardsContext.jsx
      components/
        BoardSidebar.jsx
        BoardView.jsx
        TaskColumn.jsx
        TaskCard.jsx
        TaskModal.jsx
        ConfirmDialog.jsx
        LoadingSpinner.jsx
        Toast.jsx
      App.jsx
      main.jsx
      index.css (Tailwind entry)
  README.md
  postman_collection.json (optional helper for testing APIs)
```

---

## Backend setup

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and adjust values if needed:

```bash
cp .env.example .env
```

`.env`:

```env
MONGO_URI=mongodb://localhost:27017/asana_clone
PORT=5000
```

Make sure MongoDB is running locally (or point `MONGO_URI` at any reachable MongoDB instance).

### 3. Seed the database

```bash
npm run seed
```

This will:

- Connect to `MONGO_URI`.
- Clear existing `boards` and `tasks` data.
- Insert **2 boards** and **6 sample tasks**.

### 4. Run the backend

```bash
# development with auto-reload
npm run dev

# or production-style
npm start
```

The API server listens on `http://localhost:5000` by default.

---

## Backend API

All responses are JSON. Validation errors return **4xx** with a helpful `message` field.

### GET /boards

Returns all boards.

**Example**

```bash
curl http://localhost:5000/boards
```

**Response**

```json
[
  {
    "_id": "...",
    "name": "Product Roadmap",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
]
```

---

### POST /boards

Create a new board.

- Body must include `name` (string, required).

**Request body**

```json
{ "name": "Frontend Tasks" }
```

**Example**

```bash
curl -X POST http://localhost:5000/boards \
  -H "Content-Type: application/json" \
  -d '{"name":"Frontend Tasks"}'
```

---

### GET /boards/:id/tasks

Get all tasks belonging to a given board. Returns a **flat array**.

**Example**

```bash
curl http://localhost:5000/boards/<BOARD_ID>/tasks
```

**Response**

```json
[
  {
    "_id": "...",
    "title": "Build login form",
    "description": "Create login form with validation",
    "status": "To Do",
    "priority": "High",
    "assignedTo": "Alice",
    "dueDate": "2025-12-01T00:00:00.000Z",
    "boardId": "<BOARD_ID>",
    "createdAt": "..."
  }
]
```

---

### POST /boards/:id/tasks

Create a new task for the given board.

- Required field: `title` (string).
- Optional fields: `description`, `status`, `priority`, `assignedTo`, `dueDate`.
- `status` must be one of `"To Do"`, `"In Progress"`, `"Done"`.
- `priority` must be one of `"Low"`, `"Medium"`, `"High"`.

**Request body (example)**

```json
{
  "title": "Build login form",
  "description": "Create login form with validation",
  "status": "To Do",
  "priority": "High",
  "assignedTo": "Alice",
  "dueDate": "2025-12-01T00:00:00.000Z"
}
```

**Example**

```bash
curl -X POST http://localhost:5000/boards/<BOARD_ID>/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Build login form",
    "description":"Create login form with validation",
    "status":"To Do",
    "priority":"High",
    "assignedTo":"Alice",
    "dueDate":"2025-12-01T00:00:00.000Z"
  }'
```

---

### PUT /tasks/:id

Partial update of a task. Any subset of fields can be sent.

**Example**

```bash
curl -X PUT http://localhost:5000/tasks/<TASK_ID> \
  -H "Content-Type: application/json" \
  -d '{"status":"In Progress"}'
```

The frontend uses this to update task status, as well as other fields when editing.

---

### DELETE /tasks/:id

Delete a task.

**Example**

```bash
curl -X DELETE http://localhost:5000/tasks/<TASK_ID>
```

Returns `204 No Content` on success.

---

## Frontend setup

### 1. Install dependencies

```bash
cd ../frontend
npm install
```

### 2. Configure API base URL (optional)

By default, the frontend calls `http://localhost:5000`. To change it, create a `.env` file in `frontend/`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

### 3. Run the frontend

```bash
npm run dev
```

Open the printed URL (typically `http://localhost:5173`).

Make sure the backend (`npm run dev` in `backend/`) is running first.

---

## Frontend behavior

- **Sidebar (Board list)**
  - Lists all boards from `GET /boards`.
  - Active board is highlighted.
  - New board form validates required name and posts to `POST /boards`.

- **Board view**
  - Shows tasks for the selected board in three columns: `To Do`, `In Progress`, `Done`.
  - Uses `GET /boards/:id/tasks` to fetch tasks.
  - `Create Task` button opens a modal.
  - Clicking a task card opens the same modal pre-populated for editing.
  - Each task card shows title, assignee, formatted due date, and a color-coded priority badge.
  - An **overdue indicator** appears if `dueDate < today` and status is not `Done`.
  - Task status is updated via a dropdown on the card (calls `PUT /tasks/:id`).

- **Task modal**
  - Validates required `title` on the client.
  - On create: calls `POST /boards/:id/tasks`.
  - On edit: calls `PUT /tasks/:id` with updated fields.

- **Delete task**
  - A confirmation dialog appears before deleting.
  - On confirm: calls `DELETE /tasks/:id` and updates UI.

- **Loading & errors**
  - Small loading indicator when fetching.
  - Simple toast component for showing error messages.

- **Responsive layout**
  - Columns stack vertically on narrow screens.
  - Sidebar becomes horizontal at the top on small viewports.

---

## Bonus features implemented

- **Search bar** in the board header to filter tasks by title (client-side).
- **Priority filter** dropdown to show all tasks or just High/Medium/Low priority.

Drag-and-drop via `react-beautiful-dnd` is **not** included to keep dependencies minimal, but can be added later by wrapping each column in a `Droppable` and each `TaskCard` in a `Draggable` and then calling `PUT /tasks/:id` when a drag ends.

---

## Postman collection (optional)

A simple Postman-compatible collection is included at `postman_collection.json` with basic requests for all routes:

- `GET /boards`
- `POST /boards`
- `GET /boards/:id/tasks`
- `POST /boards/:id/tasks`
- `PUT /tasks/:id`
- `DELETE /tasks/:id`

You can import it into Postman/Insomnia and adjust the `{{baseUrl}}` variable to `http://localhost:5000`.

---

## Deployment notes (high level)

- **Backend (Render/Heroku)**
  - Set environment variables `MONGO_URI` and `PORT` in the dashboard.
  - Use `npm install` and `npm start` as build/run commands.
  - Ensure MongoDB is reachable from the hosting environment.

- **Frontend (Vercel/Netlify)**
  - Deploy the `frontend/` directory as a static site with `npm run build`.
  - Set `VITE_API_BASE_URL` to the deployed backend URL (e.g. `https://your-backend.onrender.com`).

With these steps, an interviewer should be able to clone, install, seed, and run the full project in **5–10 minutes**.
