const cleanUpUrl = (url: string) => {
  try {
    return url.split("?")[0];
  } catch {
    return "";
  }
};

export default cleanUpUrl;
