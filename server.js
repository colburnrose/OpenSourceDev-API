// require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
// const helmet = require("helmet");
const { readdirSync } = require("fs");
const { NODE_ENV } = require("./config");
const { PORT, DB_URL } = require("./config");

const app = express();

// DB: CONNECTION CONFIGURATION
// const db = knex({
//   client: "pg",
//   connection: DB_URL,
// });

// DB: Connection
// mongoose configuration
mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database Connected!"))
  .catch((error) => console.log(error.message));

// route middleware
const morganConfig = NODE_ENV === "production" ? "tiny" : "common";
app.use(morgan(morganConfig));
// app.use(helmet());
app.use(cors());
app.use(express.json());

// map through each route and apply as middleware e.g. app.use('/api', router);
readdirSync("./routes").map((route) =>
  app.use("/api", require(`./routes/${route}`))
);

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
