const generateQRCode = async (data: string): Promise<string> => {
  const baseUrl = process.env.NEXT_PUBLIC_QR_SERVER_URL;    
  const url = new URL(baseUrl);
  url.searchParams.append('url', data);
  const response = await fetch(url.toString());
  return response.text();
};

export default generateQRCode;
