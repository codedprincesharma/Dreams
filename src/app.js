import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const app = express();

// ==========================================
// SECURITY & PERFORMANCE POLISH
// ==========================================

// Security Headers
app.use(helmet({
  contentSecurityPolicy: false, // Set to false if using external CDNs or Swagger
}));

// Compression for faster responses
app.use(compression());

// Request logging
app.use(morgan('dev'));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes"
  }
});
app.use("/api/", limiter);

// Basic Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// CORS Configuration
app.use(
  cors({
    origin: [
      "http://localhost:8080",
      "http://localhost:5173",
      "http://localhost:3001",
      "http://localhost:3000",
      "http://127.0.0.1:3001",
      "http://127.0.0.1:3000"
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// ==========================================
// API DOCUMENTATION (SWAGGER)
// ==========================================

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Dream School API - Premium Edition",
    version: "1.1.0",
    description: "High-performance API documentation for Dream School Management System",
    contact: {
      name: "API Support",
      email: "support@dreamschool.com"
    }
  },
  servers: [
    {
      url: "http://localhost:3000/api/v1",
      description: "Local Development Server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "refresh_token",
      },
    },
  },
  security: [{ bearerAuth: [] }],
};

const specs = swaggerJSDoc({
  swaggerDefinition,
  apis: ["./src/routes/*.js"],
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, {
  swaggerOptions: {
    persistAuthorization: true,
  },
  customCss: '.swagger-ui .topbar { display: none }', // Polishing Swagger UI
}));

// ==========================================
// ROUTES
// ==========================================

import userRoute from "../src/routes/user.route.js";
import masterLessonRoute from "../src/routes/masterLesson.route.js"
import schoolLessonRoute from "../src/routes/schoolLesson.route.js"
import schoolRoute from "../src/routes/school.route.js";
import studentRoute from "../src/routes/student.route.js";
import teacherRoute from "../src/routes/teacher.route.js";
import classRoute from "../src/routes/class.route.js";
import lessonPlanRoute from "../src/routes/lessonPlan.route.js";
import timetableRoute from "../src/routes/timetable.route.js";
import examRoute from "../src/routes/exam.route.js";
import marksRoute from "../src/routes/marks.route.js";
import syllabusRoute from "../src/routes/syllabus.route.js";
import dashboardRoute from "../src/routes/dashboard.route.js";

app.use("/api/v1/schools", schoolRoute);
app.use("/api/v1/students", studentRoute);
app.use("/api/v1/teachers", teacherRoute);
app.use("/api/v1/classes", classRoute);
app.use("/api/v1/lesson-plans", lessonPlanRoute);
app.use("/api/v1/timetables", timetableRoute);
app.use("/api/v1/exams", examRoute);
app.use("/api/v1/marks", marksRoute);
app.use("/api/v1/syllabus", syllabusRoute);
app.use("/api/v1/dashboard", dashboardRoute);
app.use("/api/v1", userRoute);
app.use('/api/v1/master-lessons', masterLessonRoute);
app.use("/api/v1/school-lessons", schoolLessonRoute);

// Home Route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "Healthy",
    message: "Dream School API is running",
    version: "1.1.0",
    docs: "/api-docs"
  });
});

// ==========================================
// ERROR HANDLING POLISH
// ==========================================

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: Object.values(err.errors).map(val => val.message).join(', ')
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: `Duplicate field value entered: ${Object.keys(err.keyValue)}`
    });
  }

  console.error(`[ERROR] ${req.method} ${req.url}:`, err.message);

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

export default app;
