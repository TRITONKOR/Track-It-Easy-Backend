ALTER TABLE "saved_parcels" RENAME TO "followed_parcels";--> statement-breakpoint
ALTER TABLE "followed_parcels" DROP CONSTRAINT "saved_parcels_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "followed_parcels" DROP CONSTRAINT "saved_parcels_parcelId_parcels_id_fk";
--> statement-breakpoint
ALTER TABLE "parcels" ADD COLUMN "isFollowed" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "followed_parcels" ADD CONSTRAINT "followed_parcels_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "followed_parcels" ADD CONSTRAINT "followed_parcels_parcelId_parcels_id_fk" FOREIGN KEY ("parcelId") REFERENCES "public"."parcels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");