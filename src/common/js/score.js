export function formatScore (score) {
  let scoreString = score + ''
  let posDecimal = scoreString.indexOf('.')
  if (posDecimal < 0) {
    posDecimal = scoreString.length
    scoreString += '.'
  }
  while (scoreString.length < posDecimal + 2) {
    scoreString += '0'
  }
  return scoreString
}
