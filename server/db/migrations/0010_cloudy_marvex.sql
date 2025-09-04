CREATE TABLE "wallet_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"kind" text NOT NULL,
	"method" text NOT NULL,
	"source_type" text,
	"source_id" uuid,
	"note" text,
	"amount_cents" integer NOT NULL,
	"created_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "chk_wallet_tx_nonzero" CHECK ("wallet_transactions"."amount_cents" <> 0)
);
--> statement-breakpoint
CREATE TABLE "wallets" (
	"user_id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "posts" CASCADE;--> statement-breakpoint
ALTER TABLE "wallet_transactions" ADD CONSTRAINT "wallet_transactions_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallet_transactions" ADD CONSTRAINT "wallet_transactions_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_wallet_tx_user" ON "wallet_transactions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_wallet_tx_source" ON "wallet_transactions" USING btree ("source_type","source_id");