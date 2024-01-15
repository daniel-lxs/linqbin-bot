export type NewEntryDto = Pick<
  Entry,
  'content' | 'ttl' | 'visitCountThreshold'
> & { title?: string };

export type Entry = {
  id: number;
  shortSlug: string;
  slug: string;
  title?: string;
  content: string;
  ttl: number;
  visitCountThreshold: number;
  remainingVisits: number;
  createdOn: string;
  expiresOn: string;
  deletedOn: string | null;
};
