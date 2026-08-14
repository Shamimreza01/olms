import Setting from "../models/setting.model.js";

const checkMaintenance = async (req, res, next) => {
  try {
    // Admins can bypass maintenance mode
    if (req.user && req.user.role === "admin") {
      return next();
    }

    const setting = await Setting.findOne();
    if (setting && setting.maintenanceMode?.enabled) {
      return res.status(503).json({
        message:
          setting.maintenanceMode.message ||
          "System is currently undergoing maintenance.",
      });
    }

    next();
  } catch (error) {
    next();
  }
};

export default checkMaintenance;
