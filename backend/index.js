import app from "./app.js";
import connectDB from "./configs/mongodb.js";
import { logger } from "./utils/logger.js";
import seedInitialData from "./utils/seed.js";

const PORT = process.env.PORT || 3000;

// ✅ Ensures DB is ready BEFORE server starts & seeds initial data
connectDB()
  .then(async () => {
    await seedInitialData();
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    logger.error(`❌ MongoDB connection failed: ${error.message}`);
    process.exit(1);
  });
