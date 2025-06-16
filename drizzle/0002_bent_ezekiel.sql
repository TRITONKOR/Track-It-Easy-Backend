CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
SELECT uuid_generate_v4();

CREATE TYPE "public"."action_type" AS ENUM('ban user', 'unban user', 'update parcel', 'delete parcel', 'delete tracking event');--> statement-breakpoint
CREATE TYPE "public"."courierName" AS ENUM('NovaPoshta', 'Ukrposhta', 'MeestExpress');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('email', 'push');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'user');--> statement-breakpoint
CREATE TABLE "admin_actions" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"userId" uuid NOT NULL,
	"actionType" "action_type" NOT NULL,
	"description" varchar(255) NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "couriers" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"name" "courierName" NOT NULL,
	"api" varchar(255) NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "followed_parcels" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"userId" uuid NOT NULL,
	"parcelId" uuid NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"parcelId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	"message" varchar(255) NOT NULL,
	"type" "notification_type" NOT NULL,
	"sentAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "parcels" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"trackingNumber" varchar(255) NOT NULL,
	"courierId" uuid NOT NULL,
	"statusId" uuid NOT NULL,
	"factualWeight" varchar(255) NOT NULL,
	"fromLocation" varchar(255) NOT NULL,
	"toLocation" varchar(255) NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "parcels_trackingNumber_unique" UNIQUE("trackingNumber")
);
--> statement-breakpoint
CREATE TABLE "statuses" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" varchar(255) NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tracking_events" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"parcelId" uuid NOT NULL,
	"statusLocation" varchar(255) NOT NULL,
	"isNotified" boolean DEFAULT false NOT NULL,
	"rawStatus" varchar(255) NOT NULL,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"username" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"passwordHash" varchar(255) NOT NULL,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"apiKey" varchar(255),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "admin_actions" ADD CONSTRAINT "admin_actions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "followed_parcels" ADD CONSTRAINT "followed_parcels_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "followed_parcels" ADD CONSTRAINT "followed_parcels_parcelId_parcels_id_fk" FOREIGN KEY ("parcelId") REFERENCES "public"."parcels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_parcelId_parcels_id_fk" FOREIGN KEY ("parcelId") REFERENCES "public"."parcels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parcels" ADD CONSTRAINT "parcels_courierId_couriers_id_fk" FOREIGN KEY ("courierId") REFERENCES "public"."couriers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parcels" ADD CONSTRAINT "parcels_statusId_statuses_id_fk" FOREIGN KEY ("statusId") REFERENCES "public"."statuses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tracking_events" ADD CONSTRAINT "tracking_events_parcelId_parcels_id_fk" FOREIGN KEY ("parcelId") REFERENCES "public"."parcels"("id") ON DELETE cascade ON UPDATE no action;

    INSERT INTO statuses ("id", "name", "description", "createdAt") VALUES
  ('5b3dc5f2-6dad-4200-a6c0-72ff8b14c363', 'В дорозі', 'Наразі посилка знаходиться в процесі транспортування.', NOW()),
  ('24d38b9c-40af-4b71-99f7-10710c32fdeb', 'Доставлено', 'Посилка доставлена одержувачу.', NOW()),
  ('d2677e7e-19ef-473a-b557-18924ec5ebec', 'Очікується', 'Посилка очікує на обробку.', NOW()),
  ('5d8f6c97-5aef-4ff3-bfa1-550aa7bfa7ef', 'Повернуто', 'Посилку повернули відправнику.', NOW());


INSERT INTO couriers ("id", "name", "api", "createdAt", "updatedAt") VALUES
  ('c070ad2f-4b75-484d-be4d-f50869a53a06', 'NovaPoshta', 'https://api.novaposhta.ua', NOW(), NOW()),
  ('0d081c9d-c4e4-4f7b-a186-6e98d6f814fb', 'MeestExpress', 'http://mock-api:3001', NOW(), NOW()),
  ('9c8cbe20-41fc-4835-9372-1deb3d30e019', 'Ukrposhta', 'http://mock-api:3001', NOW(), NOW());

INSERT INTO "users" ("id", "username", "email", "passwordHash", "role", "createdAt", "updatedAt")
VALUES
  ('0c3a4e7d-d19c-4818-888e-f9aaa30af1e5', 'admin', 'admin@example.com', '$2b$10$l8cbaztbcl4nBOrDArkIOue3m0lCYW5JdRAKbWA2rVbjnnHHqAScu', 'admin', NOW(), NOW());
