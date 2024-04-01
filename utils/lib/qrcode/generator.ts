const generateQRCode = async (data: string, name: string): Promise<string> => {
  const baseUrl =
    process.env.NEXT_PUBLIC_QR_SERVER_URL ||
    'https://qr-server-victor-freelance.koyeb.app/generate';
  const url = new URL(baseUrl);
  url.searchParams.append('url', data);
  url.searchParams.append('title', name);
  // const response = await fetch(url.toString());
  // // The response is a png image
  // const blob = await response.blob();
  // const imageUrl = URL.createObjectURL(blob);
  // return imageUrl;
  return url.toString();
};

export default generateQRCode;
