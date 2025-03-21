ALTER TABLE "tracking_events" RENAME COLUMN "parcelTrackingNumber" TO "parcelId";--> statement-breakpoint
ALTER TABLE "tracking_events" DROP CONSTRAINT "tracking_events_parcelTrackingNumber_parcels_trackingNumber_fk";
--> statement-breakpoint
ALTER TABLE "parcels" ADD COLUMN "fromLocation" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "parcels" ADD COLUMN "toLocation" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "tracking_events" ADD CONSTRAINT "tracking_events_parcelId_parcels_id_fk" FOREIGN KEY ("parcelId") REFERENCES "public"."parcels"("id") ON DELETE no action ON UPDATE no action;