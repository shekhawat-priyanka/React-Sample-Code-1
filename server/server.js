const express = require("express");
const connectDB = require("./config/db");
const { PORT } = require("./config/config");
const path = require("path");

const app = express();

//connect database
connectDB();

//Init Middleware
app.use(express.json({ extended: false }));

app.use("/blog/", express.static(path.join(__dirname, "public/uploads/blog/")));
// app.get('/', (req, res) => res.send('API Running'));

const PORT_ADDRESS = PORT || 5000;

app.use("/api/auth", require("./routes/api/auth/authuser"));
app.use(
  "/api/admin/emailTemplate",
  require("./routes/api/admin/emailTemplate")
);
app.use("/api/admin/blog", require("./routes/api/admin/blogs"));
app.use("/api/admin/inquiry", require("./routes/api/admin/inquiries"));
app.use("/api/admin/setting", require("./routes/api/admin/settings"));
app.use(
  "/api/admin/socialSetting",
  require("./routes/api/admin/socialSettings")
);
app.use("/api/admin/coupon", require("./routes/api/admin/coupons"));

app.listen(PORT_ADDRESS, () => console.log(`Server started on port ${PORT}`));
