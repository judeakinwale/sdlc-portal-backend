const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const morgan = require("morgan");
const colors = require("colors");
const dotenv = require("dotenv").config();
const cors = require("cors");
const errorHandler = require("./middleware/error");
const rateLimit = require("express-rate-limit");
const express = require("express");
const connectDB = require("./config/db");

// // //load env vars
// // dotenv.config({ path: "./config/.env" });

// import routes
// TODO: Add Routes
const auth  = require("./routes/auth")
const criterion  = require("./routes/criterion")
const gate  = require("./routes/gate")
const initiative  = require("./routes/initiative")
const item  = require("./routes/item")
const phase  = require("./routes/phase")
const prefix  = require("./routes/prefix")
const response  = require("./routes/response")
const type  = require("./routes/type")
const log  = require("./routes/log")

// configure express
const app = express();

//connection to the db
connectDB();

// set up app
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"))

//Sanitize data
app.use(mongoSanitize());

//set security headers
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// Prevent XSS attacks
app.use(xss());

//Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});
app.use(limiter);
app.use(cors());

// configure routes
// TODO: app.use routes
app.use("/api/v1/auth", auth)
app.use("/api/v1/criterion", criterion)
app.use("/api/v1/gate", gate)
app.use("/api/v1/initiative", initiative)
app.use("/api/v1/item", item)
app.use("/api/v1/phase", phase)
app.use("/api/v1/prefix", prefix)
app.use("/api/v1/response", response)
app.use("/api/v1/type", type)
app.use("/api/v1/log", log)

app.use(errorHandler);

app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
app.set('views', __dirname + '/public');
app.set('view engine', 'html');

app.get('/*', function(req, res) {
  if (req.xhr) {
    var pathname = url.parse(req.url).pathname;
    res.sendfile('index.html', {root: __dirname + '/public' + pathname});
  } else {
    res.render('index');
  }
});

// Error handling
app.use((req, res) => {
  res.status(400).json({
    success: false,
    message: 'Page not found!'
  });
});

app.get("/", (req, res) => {
  return res.status(200).json({ msg: "SDLC Compliance App" });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running on port ${PORT}`.yellow)
);

//Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);

  server.close(() => process.exit(1));
});
