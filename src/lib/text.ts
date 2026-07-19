export function normalizeRegionName(name: string): string {
  return name.trim().toLocaleLowerCase("tr-TR");
}

export function toTitleCaseTr(name: string): string {
  return name
    .split(" ")
    .map((word) =>
      word.length === 0
        ? word
        : word[0].toLocaleUpperCase("tr-TR") + word.slice(1).toLocaleLowerCase("tr-TR"),
    )
    .join(" ");
}
