// Dense toolbar height
export const TOOLBAR_HEIGHT = 48

// Convert an unparsed date string into a pretty one
export function generateDateString(unparsedDate) {
    const dateObj = new Date(unparsedDate)
    const time = dateObj.toLocaleTimeString('en-NZ', {
        hour: 'numeric',
        minute: '2-digit',
    })
    const date = dateObj.toLocaleDateString('en-NZ')

    return `${time} on ${date}`
}

// Convert seconds to a human readable string
export function generateDurationString(seconds) {
    const parts = []

    const hours = Math.floor(seconds / 3600)
    if (hours) parts.push(`${hours}h`)

    const minutes = Math.floor((seconds % 3600) / 60)
    if (minutes) parts.push(`${minutes}m`)

    const secondsLeft = seconds % 60
    if (secondsLeft) parts.push(`${secondsLeft}s`)

    return parts.join(' ')
}
