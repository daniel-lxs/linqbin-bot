import type { Entry, NewEntryDto } from '../types/Entry';
import { assertEntity } from '../util';

export async function createNewEntry({
  title,
  content,
  ttl,
  visitCountThreshold,
}: NewEntryDto): Promise<Entry | null> {
  try {
    const response = await fetch(`${process.env.API_URL}/entry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        content,
        visitCountThreshold,
        ttl,
      }),
    });
    const result = await response.json();

    if (
      result &&
      assertEntity<Entry>(result, ['slug', 'ttl', 'content', 'expiresOn'])
    ) {
      return result as Entry;
    }
    console.error('Error creating entry:', result);
    return null;
  } catch (error) {
    console.error('Error creating entry:', error);
    return null;
  }
}
