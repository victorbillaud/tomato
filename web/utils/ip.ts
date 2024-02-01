interface IIPResponse {
  ip: string;
  hostname: string;
  city: string;
  region: string;
  country: string;
  loc: string;
  org: string;
  postal: string;
  timezone: string;
}

export const fetchLocationByIP = async (ip: string) => {
  const request = await fetch(
    `https://ipinfo.io/${ip}/json?token=${process.env.IP_INFO_KEY}`
  );

  const response: IIPResponse = await request.json();

  return response;
};
