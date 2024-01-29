import { eq } from 'drizzle-orm/sqlite-core/expressions';
import { getDb } from '../connection';
import { dndEntrySchema } from '../models';

export function createDndEntry(userId: string) {
  try {
    const db = getDb();
    db.insert(dndEntrySchema)
      .values({ userId, createdOn: new Date(), enabled: true })
      .onConflictDoNothing()
      .run();
    return true;
  } catch (error) {
    console.error('Error creating dnd entry:', error);
  }
}

export function removeDndEntry(userId: string) {
  try {
    const db = getDb();
    db.delete(dndEntrySchema).where(eq(dndEntrySchema.userId, userId)).run();
    return true;
  } catch (error) {
    console.error('Error removing dnd entry:', error);
  }
}

export function updateDndEntry(userId: string, enabled: boolean) {
  try {
    const db = getDb();
    db.update(dndEntrySchema)
      .set({ enabled })
      .where(eq(dndEntrySchema.userId, userId))
      .run();
    return true;
  } catch (error) {
    console.error('Error updating dnd entry:', error);
  }
}

export function isDndEnabled(userId: string) {
  try {
    const db = getDb();
    const result = db
      .select()
      .from(dndEntrySchema)
      .where(eq(dndEntrySchema.userId, userId))
      .all()[0];
    return result && result.enabled;
  } catch (error) {
    console.error('Error checking if dnd is enabled:', error);
    return false;
  }
}
