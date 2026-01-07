export const getApiUrl = () => {
    const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    // Remove trailing slashes
    const cleanUrl = url.replace(/\/+$/, "")
    // Remove trailing /api if present, to ensure consistency when appending /api endpoints
    return cleanUrl.endsWith("/api") ? cleanUrl.slice(0, -4) : cleanUrl
}

export const API_URL = getApiUrl()
