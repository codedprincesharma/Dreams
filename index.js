import app from "./src/app.js";
import connectDb from "./src/config/db.js";
connectDb()

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server started on port ${PORT}`);
});
