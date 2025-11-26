const express = require('express');
const app = express();
const port = process.env.PORT || 3000; 
const path = require("path");

const userRoutes = require('./routes/userRoute'); 

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true })); 
app.use(express.json());

app.use("/libs", express.static(path.join(__dirname, "node_modules")));
app.use(express.static(path.join(__dirname, "public")));

app.use(userRoutes);

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});