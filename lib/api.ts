export const getApiUrl = () => {
    let url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

    // Trim whitespace
    url = url.trim()

    // Handle case where value includes the key (e.g. "NEXT_PUBLIC_API_URL=..." or "NEXT_PUBLIC_API_URL ...")
    if (url.startsWith("NEXT_PUBLIC_API_URL")) {
        const parts = url.split(/=| /)
        // Find the part that looks like a URL
        const urlPart = parts.find(part => part.startsWith("http"))
        if (urlPart) {
            url = urlPart
        }
    }

    // Handle potential missing slash in protocol (e.g. "https:/backend...")
    if (url.startsWith("https:/") && !url.startsWith("https://")) {
        url = url.replace("https:/", "https://")
    }

    // Remove trailing slashes
    const cleanUrl = url.replace(/\/+$/, "")
    // Remove trailing /api if present
    return cleanUrl.endsWith("/api") ? cleanUrl.slice(0, -4) : cleanUrl
}

export const API_URL = getApiUrl()
