const express = require("express");
const cors = require("cors");

const app = express();

// const allowedOrigins = [
//   "https://web-odigodi-frontend-ac2nlkqcdiye.sel4.cloudtype.app",
//   "http://localhost:3000"
//   // Add other allowed origins here if needed
// ];
// const corsOptions = {
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true, // Allow credentials, if required by your use case.,
// };

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
db.sequelize.sync();

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to odigodi backend." });
});

require("./app/routes/location.routes")(app);
require("./app/routes/trade.routes")(app);
require("./app/routes/rent.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8082;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
