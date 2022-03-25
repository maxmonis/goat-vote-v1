export function getInitials(name: string) {
  return name
    ?.split(' (')[0]
    ?.split(' ')
    ?.map(n => n[0])
    ?.join('')
}
