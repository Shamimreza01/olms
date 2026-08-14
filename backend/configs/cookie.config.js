export const accessCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
  maxAge: 1 * 60 * 1000,
};

export const refreshCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
  maxAge: 15 * 24 * 60 * 60 * 1000,
};
export const clearCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
};
