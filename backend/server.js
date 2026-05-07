import dotenv from "dotenv";
import app from "./src/app.js";
import { connectDatabase } from "./src/config/database.js";

dotenv.config();

const port = process.env.PORT || 4000;

await connectDatabase();

app.listen(port, () => {
  console.log(`Group Project Ghost API listening on http://localhost:${port}`);
});
