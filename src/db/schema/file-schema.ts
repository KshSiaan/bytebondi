import { relations } from "drizzle-orm/_relations";
import { pgTable, text, timestamp, index } from "drizzle-orm/pg-core";
import { user } from "../schema";

export const files = pgTable(
  "files",
  {
    id: text("id").primaryKey(),
    fileUrl: text("file_url").notNull(),
    fileName: text("file_name").notNull(),
    size: text("size").notNull(),
    type: text("type").notNull(),
    star: text("star").default("false").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("files_userId_idx").on(table.userId)],
);

export const fileRelations = relations(files, ({ one }) => ({
  user: one(user, {
    fields: [files.userId],
    references: [user.id],
  }),
}));
