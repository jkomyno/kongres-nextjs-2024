import { choices } from '~/lib/choices'

export function validate(city: string) {
  const errors: { city?: string } = { }

  if (city && !choices.find(({ value }) => value === city)) {
    errors.city = 'Invalid city.'
  }

  return {
    errors: Object.keys(errors).length ? errors : null,
    value: city as typeof choices[number]['value'],
  }
}
