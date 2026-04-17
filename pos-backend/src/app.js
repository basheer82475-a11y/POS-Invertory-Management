import express from "express"
import cors from "cors"
import router from "./routes/testRoutes.js";
const app = express();

app.use(express.json());
app.use(cors());
app.use("/api",router)

app.get("/",(req,res)=>{
    res.send("API is runnig...")
});


export default app;