import { pgTable, text } from "drizzle-orm/pg-core";
import { id, timestamps } from "../../utils/dbFields";
import { createInsertSchema } from "drizzle-zod";

export const posts = pgTable("posts", {
  id,
  title: text().notNull(),
  content: text().notNull(),
  info: text(),
  ...timestamps,
});

export const postsInsertSchema = createInsertSchema(posts);
