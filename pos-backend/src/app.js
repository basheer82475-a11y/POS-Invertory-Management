import express from "express";
import cors from "cors";
import router from "./routes/testRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

app.use(express.json());
app.use(cors());
// app.use("/api", router);
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.get("/", (req, res) => {
  res.send("API is runnig...");
});

export default app;
