CREATE TYPE "public"."action_type" AS ENUM('ban user', 'unban user', 'update parcel', 'delete parcel', 'delete tracking event');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('email', 'push');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'user');--> statement-breakpoint
CREATE TABLE "admin_actions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"userId" uuid NOT NULL,
	"actionType" "action_type" NOT NULL,
	"description" varchar(255) NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "couriers" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"api" varchar(255) NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY NOT NULL,
	"parcelId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	"message" varchar(255) NOT NULL,
	"type" "notification_type" NOT NULL,
	"sentAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "parcels" (
	"id" uuid PRIMARY KEY NOT NULL,
	"trackingNumber" varchar(255) NOT NULL,
	"courierId" uuid NOT NULL,
	"statusId" uuid NOT NULL,
	"status" varchar(255),
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "parcels_trackingNumber_unique" UNIQUE("trackingNumber")
);
--> statement-breakpoint
CREATE TABLE "saved_parcels" (
	"userId" uuid NOT NULL,
	"parcelId" uuid NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
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
	"id" uuid PRIMARY KEY NOT NULL,
	"parcelTrackingNumber" varchar(255) NOT NULL,
	"statusId" uuid NOT NULL,
	"location" varchar(255) NOT NULL,
	"isNotified" boolean DEFAULT false NOT NULL,
	"rawStatus" varchar(255) NOT NULL,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"username" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"passwordHash" varchar(255) NOT NULL,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "admin_actions" ADD CONSTRAINT "admin_actions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_parcelId_parcels_id_fk" FOREIGN KEY ("parcelId") REFERENCES "public"."parcels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parcels" ADD CONSTRAINT "parcels_courierId_couriers_id_fk" FOREIGN KEY ("courierId") REFERENCES "public"."couriers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parcels" ADD CONSTRAINT "parcels_statusId_statuses_id_fk" FOREIGN KEY ("statusId") REFERENCES "public"."statuses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_parcels" ADD CONSTRAINT "saved_parcels_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_parcels" ADD CONSTRAINT "saved_parcels_parcelId_parcels_id_fk" FOREIGN KEY ("parcelId") REFERENCES "public"."parcels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tracking_events" ADD CONSTRAINT "tracking_events_parcelTrackingNumber_parcels_trackingNumber_fk" FOREIGN KEY ("parcelTrackingNumber") REFERENCES "public"."parcels"("trackingNumber") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tracking_events" ADD CONSTRAINT "tracking_events_statusId_statuses_id_fk" FOREIGN KEY ("statusId") REFERENCES "public"."statuses"("id") ON DELETE no action ON UPDATE no action;