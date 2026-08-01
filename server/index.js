const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { connectToMongoDB } = require("./connection");
const userRoutes = require("./routes/user");
const videoRoutes = require("./routes/video");
const certificateRoutes = require("./routes/certificate")
const assessmentRoutes = require("./routes/assessment")
const path = require("path")
require("dotenv").config();

const app = express()

// Allow your deployed frontend + local dev. Add more origins via CLIENT_URL in .env
const allowedOrigins = [
    "http://localhost:3000",
    process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    methods: ["POST", "GET", "PUT", "DELETE", "OPTIONS",'PATCH'],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "auth-token"]
}));

// ✅ Handle Preflight (OPTIONS) Requests
app.options("*", cors());
app.use(express.urlencoded({ extended: true }));


app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(bodyParser.json());

connectToMongoDB();
app.use("/api/user", userRoutes);
app.use("/api/video", videoRoutes)
app.use("/api/certificate", certificateRoutes);
app.use("/api/assessment", assessmentRoutes);

app.get("/", (req, res) => {
    res.send("TechXpert API is running");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on the port: ${port}`);
})