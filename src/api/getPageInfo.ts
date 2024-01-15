import type { PageInfo } from '../types/PageInfo';
import { assertEntity } from '../util';

let cachedResponse: PageInfo | null = null;
let cachedUrl = '';

export async function getPageInfo(url: string): Promise<PageInfo | null> {
  if (url === cachedUrl && cachedResponse) {
    return cachedResponse;
  }

  try {
    const response = await fetch(`http://localhost:4000/page-info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });
    const data = await response.json();

    if (data || assertEntity<PageInfo>(data, ['title'])) {
      cachedUrl = url;
      cachedResponse = data as PageInfo;
      console.log(cachedResponse);
      return cachedResponse;
    }

    return null;
  } catch (error) {
    return null;
  }
}
