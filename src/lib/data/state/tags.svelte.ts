import { page } from "$app/state";

export function deriveTags() {
  const tagsParam = page.url.searchParams.get("tags");
  if (!tagsParam) return [];

  try {
    const value = JSON.parse(tagsParam);
    if (
      !Array.isArray(value) ||
      value.filter((i) => typeof i !== "string").length !== 0
    )
      return [];
    return value;
  } catch {
    return [];
  }
}
