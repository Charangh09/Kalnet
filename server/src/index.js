import app from "./app.js";
import { connectToDatabase } from "./config/db.js";

const port = process.env.PORT || 5000;

await connectToDatabase();

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
