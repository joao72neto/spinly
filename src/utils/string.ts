/**
 * Normalizes a string by converting it to lowercase and removing accents/diacritics.
 * Ideal for search queries and case/accent-insensitive text comparisons.
 *
 * Example:
 *   normalizeText("Música") => "musica"
 *   normalizeText("Café")   => "cafe"
 */
export function normalizeText(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
