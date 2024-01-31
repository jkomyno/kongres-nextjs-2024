import { choices } from "~/lib/choices";

export function validateCityValue(city: string) {
  const error = !city
    ? "No city was selected."
    : !choices.find(({ value }) => value === city)
      ? "Invalid city submitted."
      : undefined;

  return {
    error,
    value: city as typeof choices[number]['value'],
  }
}
