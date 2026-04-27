/**
 * Standardizes the API response format.
 * Helps the frontend easily parse data/errors.
 */
export function successResponse(data: any, message = "Success", status = 200) {
  return new Response(
    JSON.stringify({
      success: true,
      message,
      data,
    }),
    { status, headers: { "Content-Type": "application/json" } },
  );
}

export function errorResponse(message: string, status = 400) {
  return new Response(
    JSON.stringify({
      success: false,
      error: message,
    }),
    { status, headers: { "Content-Type": "application/json" } },
  );
}
