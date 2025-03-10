import {
    boolean,
    pgEnum,
    pgTable,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { ActionType } from "src/utils/ActionType";

export const userRoleEnum = pgEnum("user_role", ["admin", "user"]);
export const notificationTypeEnum = pgEnum("notification_type", [
    "email",
    "push",
]);
export const actionTypeEnum = pgEnum(
    "action_type",
    Object.values(ActionType) as [string, ...string[]]
);

export const usersTable = pgTable("users", {
    id: uuid().primaryKey(),
    username: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull(),
    passwordHash: varchar({ length: 255 }).notNull(),
    role: userRoleEnum().default("user").notNull(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});

export const parcelsTable = pgTable("parcels", {
    id: uuid().primaryKey(),
    trackingNumber: varchar({ length: 255 }).notNull(),
    courierId: uuid()
        .notNull()
        .references(() => couriersTable.id),
    statusId: uuid()
        .notNull()
        .references(() => statusesTable.id),
    status: varchar({ length: 255 }),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});

export const trackingEventsTable = pgTable("tracking_events", {
    id: uuid().primaryKey(),
    parcelId: uuid()
        .notNull()
        .references(() => parcelsTable.id),
    statusId: uuid()
        .notNull()
        .references(() => statusesTable.id),
    location: varchar({ length: 255 }).notNull(),
    isNotified: boolean().default(false).notNull(),
    rawStatus: varchar({ length: 255 }).notNull(),
    timestamp: timestamp({ withTimezone: true }).defaultNow().notNull(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});

export const couriersTable = pgTable("couriers", {
    id: uuid().primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    api: varchar({ length: 255 }).notNull(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});

export const statusesTable = pgTable("statuses", {
    id: uuid().primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    description: varchar({ length: 255 }).notNull(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});

export const notificationsTable = pgTable("notifications", {
    id: uuid().primaryKey(),
    parcelId: uuid()
        .notNull()
        .references(() => parcelsTable.id),
    userId: uuid()
        .notNull()
        .references(() => usersTable.id),
    message: varchar({ length: 255 }).notNull(),
    type: notificationTypeEnum().notNull(),
    sentAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});

export const adminActionsTable = pgTable("admin_actions", {
    id: uuid().primaryKey(),
    userId: uuid()
        .notNull()
        .references(() => usersTable.id),
    actionType: actionTypeEnum().notNull(),
    description: varchar({ length: 255 }).notNull(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});

export const savedParcelsTable = pgTable("saved_parcels", {
    userId: uuid()
        .notNull()
        .references(() => usersTable.id, { onDelete: "cascade" }),
    parcelId: uuid()
        .notNull()
        .references(() => parcelsTable.id, { onDelete: "cascade" }),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});
