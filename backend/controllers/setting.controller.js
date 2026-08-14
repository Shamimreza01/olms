import Setting from "../models/setting.model.js";

export const getPublicSettings = async (req, res) => {
  try {
    let setting = await Setting.findOne();
    if (!setting) {
      setting = new Setting();
      await setting.save();
    }

    res.status(200).json({
      setting: {
        institutionName: setting.institutionName,
        systemEmail: setting.systemEmail,
        currentAcademicYear: setting.currentAcademicYear,
        studentRegistration: setting.studentRegistration,
        teacherRegistration: setting.teacherRegistration,
        maintenanceMode: setting.maintenanceMode,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch public settings" });
  }
};

export const getAdminSettings = async (req, res) => {
  try {
    let setting = await Setting.findOne();
    if (!setting) {
      setting = new Setting();
      await setting.save();
    }

    res.status(200).json({ setting });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch settings" });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const {
      institutionName,
      systemEmail,
      currentAcademicYear,
      studentRegistration,
      teacherRegistration,
      teacherSecretKey,
      maxFileSize,
      maintenanceMode,
    } = req.body;

    let setting = await Setting.findOne();
    if (!setting) {
      setting = new Setting();
    }

    if (institutionName !== undefined) setting.institutionName = institutionName;
    if (systemEmail !== undefined) setting.systemEmail = systemEmail;
    if (currentAcademicYear !== undefined) setting.currentAcademicYear = currentAcademicYear;
    if (studentRegistration !== undefined) setting.studentRegistration = studentRegistration;
    if (teacherRegistration !== undefined) setting.teacherRegistration = teacherRegistration;
    if (teacherSecretKey !== undefined) setting.teacherSecretKey = teacherSecretKey;
    if (maxFileSize !== undefined) setting.maxFileSize = maxFileSize;
    if (maintenanceMode !== undefined) setting.maintenanceMode = maintenanceMode;

    await setting.save();

    res.status(200).json({ message: "Settings updated successfully", setting });
  } catch (error) {
    res.status(500).json({ message: "Failed to update settings" });
  }
};
