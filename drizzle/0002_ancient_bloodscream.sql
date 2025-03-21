CREATE TYPE "public"."courierName" AS ENUM('NovaPoshta', 'MeestExpress');--> statement-breakpoint
ALTER TABLE "couriers" ALTER COLUMN "name" SET DATA TYPE courierName;