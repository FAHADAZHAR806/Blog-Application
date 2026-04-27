import jwt from "jsonwebtoken";

interface DecodedToken {
  id: string;
  role: "author" | "reader";
}

/**
 * Verifies the JWT from the Authorization header.
 * Returns the decoded payload or null if invalid.
 */
export const verifyToken = (token: string): DecodedToken | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    return decoded;
  } catch (error) {
    return null;
  }
};
