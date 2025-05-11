export function extractParentDomain(url: string): string | null {
  try {
    // Handle URLs without protocol by adding a temporary one
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `https://${url}`;
    }

    // Parse the URL
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;

    // Handle localhost or IP addresses - no cross-subdomain cookies needed
    if (hostname === "localhost" || /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
      return null;
    }

    // Extract the main domain
    const parts = hostname.split(".");

    // For hostnames like redditime.docsify.tech, we want .docsify.tech
    // For domains with multiple subdomains like api.app.example.com, we want .example.com
    if (parts.length >= 2) {
      // Take the last two parts of the domain (.example.com)
      return `.${parts.slice(-2).join(".")}`;
    }

    // For simple domains
    return `.${hostname}`;
  } catch (error) {
    // If URL parsing fails, return null
    console.error("Error parsing URL:", error);
    return null;
  }
}
