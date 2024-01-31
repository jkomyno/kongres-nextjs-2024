export const choices = [
  {
    value: 'warszawa',
    label: 'Warszawa',
  },
  {
    value: 'krakow',
    label: 'Kraków',
  },
  {
    value: 'wroclaw',
    label: 'Wrocław',
  },
  {
    value: 'gdansk',
    label: 'Gdańsk',
  },
] as const

export const nChoices = choices.length
export const choicesMap = new Map(choices.map(({ value, label }) => [value, label]))
