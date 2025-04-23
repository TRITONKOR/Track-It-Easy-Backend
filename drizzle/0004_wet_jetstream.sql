ALTER TABLE "notifications" DROP CONSTRAINT "notifications_parcelId_parcels_id_fk";
--> statement-breakpoint
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "saved_parcels" DROP CONSTRAINT "saved_parcels_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "tracking_events" DROP CONSTRAINT "tracking_events_parcelId_parcels_id_fk";
--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_parcelId_parcels_id_fk" FOREIGN KEY ("parcelId") REFERENCES "public"."parcels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_parcels" ADD CONSTRAINT "saved_parcels_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tracking_events" ADD CONSTRAINT "tracking_events_parcelId_parcels_id_fk" FOREIGN KEY ("parcelId") REFERENCES "public"."parcels"("id") ON DELETE cascade ON UPDATE no action;