import app from "./api/index.js";
import loadEnv from "./config/loadEnv.js";

loadEnv();

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`DocEase backend running on http://localhost:${port}`);
});
