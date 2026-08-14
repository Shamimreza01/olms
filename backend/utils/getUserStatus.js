const getUserStatus = (user) => {
  if (user.currentStatus === "pending") {
    return { status: 403, message: "Account pending approval by Admin." };
  }
  if (user.currentStatus === "rejected") {
    return {
      status: 403,
      message: "Your account request has been rejected by the administrator.",
    };
  }
  if (user.currentStatus === "suspended") {
    return {
      status: 403,
      message: "Your account has been suspended by the administrator.",
    };
  }

  return null; // User is active/approved
};

export default getUserStatus;
