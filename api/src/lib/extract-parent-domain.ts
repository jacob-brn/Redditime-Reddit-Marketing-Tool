export function extractParentDomain(url: string): string | null {
  try {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `https://${url}`;
    }

    const urlObj = new URL(url);
    const hostname = urlObj.hostname;

    if (hostname === "localhost" || /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
      return null;
    }

    const parts = hostname.split(".");

    if (parts.length >= 2) {
      return `.${parts.slice(-2).join(".")}`;
    }

    return `.${hostname}`;
  } catch (error) {
    console.error("Error parsing URL:", error);
    return null;
  }
}
