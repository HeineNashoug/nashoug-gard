import postgres from "postgres";

// Én tilkobling per serverprosess. `prepare: false` trengs for Supabase sin pooler.
const g = globalThis as { __sql?: ReturnType<typeof postgres> };
export const sql = (g.__sql ??= postgres(process.env.DATABASE_URL!, { prepare: false, max: 5 }));
