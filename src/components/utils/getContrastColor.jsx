export function getContrastColor(hexColor) {
  // Remove the hash if it exists
  const color = hexColor.replace('#', '')

  // Convert to RGB
  const r = parseInt(color.substring(0, 2), 16)
  const g = parseInt(color.substring(2, 4), 16)
  const b = parseInt(color.substring(4, 6), 16)

  // Calculate brightness
  const brightness = (r * 299 + g * 587 + b * 114) / 1000

  // Return black for light backgrounds, white for dark backgrounds
  return brightness > 128 ? '#000000' : '#FFFFFF'
}