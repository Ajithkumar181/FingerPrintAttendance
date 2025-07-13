fingerprint-attendance/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/                     # Images, icons, logos, etc.
│   ├── components/                 # Reusable UI components
│   │   ├── Sidebar.jsx
│   │   ├── Topbar.jsx
│   │   ├── StatsCard.jsx
│   │   └── ...more UI widgets
│   ├── layouts/                    # Layout wrapper (Sidebar + Topbar)
│   │   └── DashboardLayout.jsx
│   ├── pages/                      # Page components (routes)
│   │   ├── Dashboard.jsx           # "/"
│   │   ├── Students.jsx            # "/students"
│   │   ├── Attendance.jsx          # "/attendance"
│   │   ├── Summary.jsx             # "/summary"
│   │   └── Export.jsx              # "/export"
│   ├── services/                   # API calls (e.g., Axios functions)
│   │   ├── studentService.js
│   │   ├── attendanceService.js
│   │   └── exportService.js
│   ├── utils/                      # Utility/helper functions
│   │   └── dateUtils.js
│   ├── App.jsx                     # Entry point with routes
│   ├── main.jsx                    # Vite mount point
│   └── index.css                   # Tailwind / global styles
├── .gitignore
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
