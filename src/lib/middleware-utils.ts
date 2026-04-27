import { errorResponse } from "./api-response";
import { verifyToken } from "./auth-utils";

type Role = "author" | "reader";

/**
 * A wrapper for API routes to protect them based on Authentication and Roles.
 */
export function withAuth(handler: Function, requiredRole?: Role) {
  return async (req: Request, ...args: any[]) => {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1]; // Bearer <token>

    if (!token) {
      return errorResponse("Authentication required", 401);
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return errorResponse("Invalid or expired token", 401);
    }

    // Check for Role-Based Access Control
    if (requiredRole && decoded.role !== requiredRole) {
      return errorResponse(
        "Forbidden: You do not have the required permissions",
        403,
      );
    }

    // Inject user info into the request context (passed to the handler)
    return handler(req, decoded, ...args);
  };
}
