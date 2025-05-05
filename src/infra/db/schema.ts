import { sql } from "drizzle-orm";
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
export const courierEnum = pgEnum("courierName", [
    "NovaPoshta",
    "MeestExpress",
]);
export const actionTypeEnum = pgEnum(
    "action_type",
    Object.values(ActionType) as [string, ...string[]]
);

export const usersTable = pgTable("users", {
    id: uuid()
        .primaryKey()
        .default(sql`uuid_generate_v4()`),
    username: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    passwordHash: varchar({ length: 255 }).notNull(),
    role: userRoleEnum().default("user").notNull(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});

export const parcelsTable = pgTable("parcels", {
    id: uuid()
        .primaryKey()
        .default(sql`uuid_generate_v4()`),
    trackingNumber: varchar({ length: 255 }).notNull().unique(),
    courierId: uuid()
        .notNull()
        .references(() => couriersTable.id),
    statusId: uuid()
        .notNull()
        .references(() => statusesTable.id),
    status: varchar({ length: 255 }).notNull(),
    factualWeight: varchar({ length: 255 }).notNull(),
    fromLocation: varchar({ length: 255 }).notNull(),
    toLocation: varchar({ length: 255 }).notNull(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});

export const trackingEventsTable = pgTable("tracking_events", {
    id: uuid()
        .primaryKey()
        .default(sql`uuid_generate_v4()`),
    parcelId: uuid()
        .notNull()
        .references(() => parcelsTable.id, { onDelete: "cascade" }),
    statusLocation: varchar({ length: 255 }).notNull(),
    isNotified: boolean().default(false).notNull(),
    rawStatus: varchar({ length: 255 }).notNull(),
    timestamp: timestamp({ withTimezone: true }).defaultNow().notNull(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});

export const couriersTable = pgTable("couriers", {
    id: uuid()
        .primaryKey()
        .default(sql`uuid_generate_v4()`),
    name: courierEnum().notNull(),
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
    id: uuid()
        .primaryKey()
        .default(sql`uuid_generate_v4()`),
    parcelId: uuid()
        .notNull()
        .references(() => parcelsTable.id, { onDelete: "cascade" }),
    userId: uuid()
        .notNull()
        .references(() => usersTable.id, { onDelete: "cascade" }),
    message: varchar({ length: 255 }).notNull(),
    type: notificationTypeEnum().notNull(),
    sentAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});

export const adminActionsTable = pgTable("admin_actions", {
    id: uuid()
        .primaryKey()
        .default(sql`uuid_generate_v4()`),
    userId: uuid()
        .notNull()
        .references(() => usersTable.id),
    actionType: actionTypeEnum().notNull(),
    description: varchar({ length: 255 }).notNull(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});

export const followedParcelsTable = pgTable("followed_parcels", {
    id: uuid()
        .primaryKey()
        .default(sql`uuid_generate_v4()`),
    userId: uuid()
        .notNull()
        .references(() => usersTable.id),
    parcelId: uuid()
        .notNull()
        .references(() => parcelsTable.id, { onDelete: "cascade" }),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});
