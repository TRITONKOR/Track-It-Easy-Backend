ALTER TABLE "tracking_events" RENAME COLUMN "statusId" TO "statusLocation";--> statement-breakpoint
ALTER TABLE "tracking_events" DROP CONSTRAINT "tracking_events_statusId_statuses_id_fk";
--> statement-breakpoint
ALTER TABLE "tracking_events" DROP COLUMN "location";