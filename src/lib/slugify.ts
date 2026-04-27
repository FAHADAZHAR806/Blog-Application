export function slugify(text: string): string {
  return (
    text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\w-]+/g, "") // Remove all non-word chars
      .replace(/--+/g, "-") + // Replace multiple - with single -
    "-" +
    Math.random().toString(36).substring(2, 7)
  ); // Append random string for uniqueness
}
