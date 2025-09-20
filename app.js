import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
const port = 3000;
import  connectdb  from "./db/connectdb.js"; 
import route from "./routes/route.js";
import adminroute from "./routes/adminroute.js"; 


import redirectRoute from "./routes/redirectRoute.js";
// Mount under /redirect
app.use("/redirect", redirectRoute);

const DATABASE_URL = process.env.DATABASE_URL;

// DB connection
connectdb(DATABASE_URL);

// Middleware for JSON
app.use(express.json());
app.use('/api',route);
app.use('/admin',adminroute);


app.listen(port, () => {
    console.log(`Server is running at port: ${port}`);
});
