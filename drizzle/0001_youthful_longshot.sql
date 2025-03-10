ALTER TABLE "admin_actions" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "admin_actions" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "couriers" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "couriers" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "notifications" RENAME COLUMN "parcelId" TO "parcel_id";--> statement-breakpoint
ALTER TABLE "notifications" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "notifications" RENAME COLUMN "sentAt" TO "sent_at";--> statement-breakpoint
ALTER TABLE "parcels" RENAME COLUMN "trackingNumber" TO "tracking_number";--> statement-breakpoint
ALTER TABLE "parcels" RENAME COLUMN "courierId" TO "courier_id";--> statement-breakpoint
ALTER TABLE "parcels" RENAME COLUMN "statusId" TO "status_id";--> statement-breakpoint
ALTER TABLE "parcels" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "parcels" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "saved_parcels" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "saved_parcels" RENAME COLUMN "parcelId" TO "parcel_id";--> statement-breakpoint
ALTER TABLE "saved_parcels" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "statuses" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "tracking_events" RENAME COLUMN "parcelId" TO "parcel_id";--> statement-breakpoint
ALTER TABLE "tracking_events" RENAME COLUMN "statusId" TO "status_id";--> statement-breakpoint
ALTER TABLE "tracking_events" RENAME COLUMN "isNotified" TO "is_notified";--> statement-breakpoint
ALTER TABLE "tracking_events" RENAME COLUMN "rawStatus" TO "raw_status";--> statement-breakpoint
ALTER TABLE "tracking_events" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "passwordHash" TO "password_hash";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "admin_actions" DROP CONSTRAINT "admin_actions_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_parcelId_parcels_id_fk";
--> statement-breakpoint
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "parcels" DROP CONSTRAINT "parcels_courierId_couriers_id_fk";
--> statement-breakpoint
ALTER TABLE "parcels" DROP CONSTRAINT "parcels_statusId_statuses_id_fk";
--> statement-breakpoint
ALTER TABLE "saved_parcels" DROP CONSTRAINT "saved_parcels_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "saved_parcels" DROP CONSTRAINT "saved_parcels_parcelId_parcels_id_fk";
--> statement-breakpoint
ALTER TABLE "tracking_events" DROP CONSTRAINT "tracking_events_parcelId_parcels_id_fk";
--> statement-breakpoint
ALTER TABLE "tracking_events" DROP CONSTRAINT "tracking_events_statusId_statuses_id_fk";
--> statement-breakpoint
ALTER TABLE "admin_actions" ADD CONSTRAINT "admin_actions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_parcel_id_parcels_id_fk" FOREIGN KEY ("parcel_id") REFERENCES "public"."parcels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parcels" ADD CONSTRAINT "parcels_courier_id_couriers_id_fk" FOREIGN KEY ("courier_id") REFERENCES "public"."couriers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parcels" ADD CONSTRAINT "parcels_status_id_statuses_id_fk" FOREIGN KEY ("status_id") REFERENCES "public"."statuses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_parcels" ADD CONSTRAINT "saved_parcels_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_parcels" ADD CONSTRAINT "saved_parcels_parcel_id_parcels_id_fk" FOREIGN KEY ("parcel_id") REFERENCES "public"."parcels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tracking_events" ADD CONSTRAINT "tracking_events_parcel_id_parcels_id_fk" FOREIGN KEY ("parcel_id") REFERENCES "public"."parcels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tracking_events" ADD CONSTRAINT "tracking_events_status_id_statuses_id_fk" FOREIGN KEY ("status_id") REFERENCES "public"."statuses"("id") ON DELETE no action ON UPDATE no action;