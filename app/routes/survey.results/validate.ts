import { choices } from "../route";

export function validate(city: string) {
  let errors: { city?: string } = { };

  if (city && !choices.find(({ value }) => value === city)) {
    errors.city = "Invalid city.";
  }

  return {
    errors: Object.keys(errors).length ? errors : null,
    value: city as typeof choices[number]['value'],
  }
}
