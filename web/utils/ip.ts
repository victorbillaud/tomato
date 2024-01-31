import { headers } from 'next/headers';

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

export const fetchLocationByIP = async () => {
  const headersList = headers();

  const request = await fetch(
    `https://ipinfo.io/json?token=${process.env.IP_INFO_KEY}`
  );

  const response: IIPResponse = await request.json();

  return response;
};
