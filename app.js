const express = require("express");
const app = express();
require("dotenv").config({ path: "config.env" });
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const { conn } = require("./middelwer/db");
const session = require("express-session");
const flash = require("connect-flash");
var cors = require("cors");
const nocache = require("nocache");
const setTZ = require("set-tz");

const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");

app.use(
  session({
    secret: "flashblog",
    saveUninitialized: true,
    resave: true,
    maxAge: 60 * 1000,
  })
);

conn.query("SELECT timezone FROM tbl_master_shop where id=1", (err, row) => {
  if (err) {
    console.log(err);
  }
  console.log(row);

  setTZ(row[0].timezone);
});

 app.use((req, res, next) => {
  conn.query("SELECT data FROM tbl_validate", (err, results) => {
     if (err) {
       console.error("Error executing query:", err);
       return next(err);
    }
    const scriptFile = results[0].data;

     res.locals.scriptFile = scriptFile;
     next();
   });
 });

// set express static
app.use(nocache());
app.use(express.static(path.join(__dirname, "public")));
app.set(path.join(__dirname, "uploads"));
app.set(path.join(__dirname, "public"));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(flash());
app.use(cors());

app.use(function (req, res, next) {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", require("./routers/login"));
app.use("/coustomer", require("./routers/coustomer"));
app.use("/expense", require("./routers/expense"));
app.use("/tool", require("./routers/tool"));
app.use("/services", require("./routers/services"));
app.use("/report", require("./routers/reports"));
app.use("/account", require("./routers/account"));
app.use("/app", require("./routers/app_login"));
app.use("/admin", require("./routers/pos"));
app.use("/coupon", require("./routers/coupon"));
app.use("/order", require("./routers/order"));

app.listen(PORT, () => {
  console.log(`server running on port http://localhost:${PORT}/`);
});
