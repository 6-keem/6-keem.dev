import { cookies } from 'next/headers';
import { getBaseUrl } from './base-url';

export async function internalGet(path: string) {
  const BASE_URL = getBaseUrl();
  const c = await cookies();
  const cookieHeader = c.toString();

  const res = await fetch(`${BASE_URL}${path}`, {
    cache: 'no-store',
    headers: {
      cookie: cookieHeader,
    },
  });

  return res;
}
