import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_highlights_items_link_type" AS ENUM('booking', 'whatsapp', 'internal', 'custom', 'none');
  CREATE TYPE "public"."enum_pages_blocks_highlights_items_link_route" AS ENUM('inicio', 'nosotros', 'equipo', 'servicios', 'casos-de-exito', 'cultura-msa', 'blog', 'contacto', 'privacidad');
  CREATE TYPE "public"."enum__pages_v_blocks_highlights_items_link_type" AS ENUM('booking', 'whatsapp', 'internal', 'custom', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_highlights_items_link_route" AS ENUM('inicio', 'nosotros', 'equipo', 'servicios', 'casos-de-exito', 'cultura-msa', 'blog', 'contacto', 'privacidad');
  CREATE TABLE "pages_blocks_highlights_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"accent" boolean DEFAULT false,
  	"image_id" integer,
  	"link_type" "enum_pages_blocks_highlights_items_link_type" DEFAULT 'booking',
  	"link_route" "enum_pages_blocks_highlights_items_link_route",
  	"link_url" varchar
  );
  
  CREATE TABLE "pages_blocks_highlights_items_locales" (
  	"label" varchar,
  	"title" varchar,
  	"text" varchar,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_highlights_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"accent" boolean DEFAULT false,
  	"image_id" integer,
  	"link_type" "enum__pages_v_blocks_highlights_items_link_type" DEFAULT 'booking',
  	"link_route" "enum__pages_v_blocks_highlights_items_link_route",
  	"link_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_highlights_items_locales" (
  	"label" varchar,
  	"title" varchar,
  	"text" varchar,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_highlights_items" ADD CONSTRAINT "pages_blocks_highlights_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_highlights_items" ADD CONSTRAINT "pages_blocks_highlights_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_highlights_items_locales" ADD CONSTRAINT "pages_blocks_highlights_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_highlights_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_highlights" ADD CONSTRAINT "pages_blocks_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_highlights_items" ADD CONSTRAINT "_pages_v_blocks_highlights_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_highlights_items" ADD CONSTRAINT "_pages_v_blocks_highlights_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_highlights_items_locales" ADD CONSTRAINT "_pages_v_blocks_highlights_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_highlights_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_highlights" ADD CONSTRAINT "_pages_v_blocks_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_highlights_items_order_idx" ON "pages_blocks_highlights_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_highlights_items_parent_id_idx" ON "pages_blocks_highlights_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_highlights_items_image_idx" ON "pages_blocks_highlights_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_blocks_highlights_items_locales_locale_parent_id_uniqu" ON "pages_blocks_highlights_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_highlights_items_locales_parent_id_idx" ON "pages_blocks_highlights_items_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_highlights_order_idx" ON "pages_blocks_highlights" USING btree ("_order");
  CREATE INDEX "pages_blocks_highlights_parent_id_idx" ON "pages_blocks_highlights" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_highlights_path_idx" ON "pages_blocks_highlights" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_highlights_items_order_idx" ON "_pages_v_blocks_highlights_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_highlights_items_parent_id_idx" ON "_pages_v_blocks_highlights_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_highlights_items_image_idx" ON "_pages_v_blocks_highlights_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_highlights_items_locales_locale_parent_id_un" ON "_pages_v_blocks_highlights_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_highlights_items_locales_parent_id_idx" ON "_pages_v_blocks_highlights_items_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_highlights_order_idx" ON "_pages_v_blocks_highlights" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_highlights_parent_id_idx" ON "_pages_v_blocks_highlights" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_highlights_path_idx" ON "_pages_v_blocks_highlights" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_highlights_items" CASCADE;
  DROP TABLE "pages_blocks_highlights_items_locales" CASCADE;
  DROP TABLE "pages_blocks_highlights" CASCADE;
  DROP TABLE "_pages_v_blocks_highlights_items" CASCADE;
  DROP TABLE "_pages_v_blocks_highlights_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_highlights" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_highlights_items_link_type";
  DROP TYPE "public"."enum_pages_blocks_highlights_items_link_route";
  DROP TYPE "public"."enum__pages_v_blocks_highlights_items_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_highlights_items_link_route";`)
}
