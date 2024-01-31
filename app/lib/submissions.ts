let nSubmissions = 0

export function getNSubmissions() {
  return nSubmissions
}

export function incrementNSubmissions() {
  nSubmissions++
  return nSubmissions
}
