fingerprint-attendance-backend/
├── config/
│   └── db.js                  ← PostgreSQL connection setup
│
├── controllers/
│   ├── attendanceController.js
│   ├── studentController.js
│   └── statsController.js     ← Admin stats, exports
│
├── routes/
│   ├── attendanceRoutes.js
│   ├── studentRoutes.js
│   └── statsRoutes.js
│
├── middlewares/
│   └── errorHandler.js        ← Error handling middleware
│
├── utils/
│   └── csvExporter.js         ← Export attendance to CSV
│
├── .env                       ← Environment config
├── server.js                  ← App entry point
├── package.json




Here's a breakdown of **use cases mapped to folders and files** for your `fingerprint-attendance-backend/` Node.js project using Express + PostgreSQL:

---

## ✅ `controllers/` Folder – **Business Logic Handlers**

### 📄 `attendanceController.js`

Handles core fingerprint-based attendance operations:

| Use Case                            | Endpoint                           | Description                                          |
| ----------------------------------- | ---------------------------------- | ---------------------------------------------------- |
| ✅ Mark attendance from ESP32        | `POST /api/attendance/mark`        | Updates `status = 'Present'` for scanned fingerprint |
| ✅ Initialize all students as absent | `POST /api/attendance/init-absent` | Adds `'Absent'` entries at beginning of day          |
| ✅ Export attendance CSV             | `GET /api/attendance/export`       | Uses utility to export filtered records              |

---

### 📄 `studentController.js`

Handles student onboarding and queries:

| Use Case                         | Endpoint                               | Description                                        |
| -------------------------------- | -------------------------------------- | -------------------------------------------------- |
| ✅ Enroll new student             | `POST /api/students/enroll`            | Adds student + fingerprint mapping                 |
| ✅ Get student by fingerprint     | `GET /api/fingerprint/:fingerprint_id` | ESP32 can verify identity                          |
| ✅ Get student attendance history | `GET /api/students/:id/attendance`     | Shows list of dates with present/absent status     |
| ✅ Delete student                 | `DELETE /api/students/:id`             | Cascade deletes fingerprint and attendance records |

---

### 📄 `statsController.js`

Admin-only insights and stats:

| Use Case                    | Endpoint                            | Description                 |
| --------------------------- | ----------------------------------- | --------------------------- |
| ✅ Daily summary stats       | `GET /api/stats/today`              | Total present, absent, etc. |
| ✅ Monthly attendance trends | `GET /api/stats/monthly` (optional) | Attendance rate over time   |

---

## ✅ `routes/` Folder – **API Endpoints & Routing**

Each route file maps HTTP requests to controller functions:

| File                  | Mounted At        | Description                              |
| --------------------- | ----------------- | ---------------------------------------- |
| `attendanceRoutes.js` | `/api/attendance` | Fingerprint marking, export, init-absent |
| `studentRoutes.js`    | `/api/students`   | CRUD for student & fingerprint           |
| `statsRoutes.js`      | `/api/stats`      | Admin dashboard stats                    |

---

## ✅ `config/` Folder – **Database Configuration**

| File    | Description                                                                  |
| ------- | ---------------------------------------------------------------------------- |
| `db.js` | Sets up and exports PostgreSQL pool. Also runs a test connection at startup. |

---

## ✅ `middlewares/` Folder – **Error Handling**

| File              | Description                                                                          |
| ----------------- | ------------------------------------------------------------------------------------ |
| `errorHandler.js` | Catch-all for unhandled errors, useful in production deployment. (optional to build) |

---

## ✅ `utils/` Folder – **Helper Utilities**

| File             | Description                                                                |
| ---------------- | -------------------------------------------------------------------------- |
| `csvExporter.js` | Converts attendance data to downloadable CSV file. Used in export feature. |

---

## ✅ Root Files

| File           | Description                                    |
| -------------- | ---------------------------------------------- |
| `.env`         | DB connection vars: `DB_HOST`, `DB_NAME`, etc. |
| `server.js`    | Main entry point. Loads express, routes, db.   |
| `package.json` | Dependencies, scripts, project meta.           |

---

## 🚀 Summary of Backend Use Cases by Folder

| Folder           | Use Cases                                         |
| ---------------- | ------------------------------------------------- |
| **controllers/** | Attendance marking, student registration, stats   |
| **routes/**      | API endpoints for attendance, students, and stats |
| **utils/**       | CSV exporting                                     |
| **config/**      | PostgreSQL setup                                  |
| **middlewares/** | Error handling                                    |
| **root**         | `.env` config, `server.js` app                    |

---

Would you like a `README.md` template for this project too?
