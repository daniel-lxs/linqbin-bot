export type NewEntryDto = Pick<
  Entry,
  'content' | 'ttl' | 'visitCountThreshold'
> & { title?: string };

export type Entry = {
  slug: string;
  title?: string;
  content: string;
  ttl: number;
  visitCountThreshold: number;
  remainingVisits: number;
  createdOn: string;
  expiresOn: string;
};
