CREATE TABLE IF NOT EXISTS "migrations"(
  "id" integer primary key autoincrement not null,
  "migration" varchar not null,
  "batch" integer not null
);
CREATE TABLE IF NOT EXISTS "users"(
  "id" integer primary key autoincrement not null,
  "name" varchar not null,
  "email" varchar not null,
  "email_verified_at" datetime,
  "password" varchar not null,
  "remember_token" varchar,
  "created_at" datetime,
  "updated_at" datetime,
  "two_factor_secret" text,
  "two_factor_recovery_codes" text,
  "two_factor_confirmed_at" datetime
);
CREATE UNIQUE INDEX "users_email_unique" on "users"("email");
CREATE TABLE IF NOT EXISTS "password_reset_tokens"(
  "email" varchar not null,
  "token" varchar not null,
  "created_at" datetime,
  primary key("email")
);
CREATE TABLE IF NOT EXISTS "sessions"(
  "id" varchar not null,
  "user_id" integer,
  "ip_address" varchar,
  "user_agent" text,
  "payload" text not null,
  "last_activity" integer not null,
  primary key("id")
);
CREATE INDEX "sessions_user_id_index" on "sessions"("user_id");
CREATE INDEX "sessions_last_activity_index" on "sessions"("last_activity");
CREATE TABLE IF NOT EXISTS "cache"(
  "key" varchar not null,
  "value" text not null,
  "expiration" integer not null,
  primary key("key")
);
CREATE TABLE IF NOT EXISTS "cache_locks"(
  "key" varchar not null,
  "owner" varchar not null,
  "expiration" integer not null,
  primary key("key")
);
CREATE TABLE IF NOT EXISTS "jobs"(
  "id" integer primary key autoincrement not null,
  "queue" varchar not null,
  "payload" text not null,
  "attempts" integer not null,
  "reserved_at" integer,
  "available_at" integer not null,
  "created_at" integer not null
);
CREATE INDEX "jobs_queue_index" on "jobs"("queue");
CREATE TABLE IF NOT EXISTS "job_batches"(
  "id" varchar not null,
  "name" varchar not null,
  "total_jobs" integer not null,
  "pending_jobs" integer not null,
  "failed_jobs" integer not null,
  "failed_job_ids" text not null,
  "options" text,
  "cancelled_at" integer,
  "created_at" integer not null,
  "finished_at" integer,
  primary key("id")
);
CREATE TABLE IF NOT EXISTS "failed_jobs"(
  "id" integer primary key autoincrement not null,
  "uuid" varchar not null,
  "connection" text not null,
  "queue" text not null,
  "payload" text not null,
  "exception" text not null,
  "failed_at" datetime not null default CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "failed_jobs_uuid_unique" on "failed_jobs"("uuid");
CREATE TABLE IF NOT EXISTS "personal_access_tokens"(
  "id" integer primary key autoincrement not null,
  "tokenable_type" varchar not null,
  "tokenable_id" integer not null,
  "name" text not null,
  "token" varchar not null,
  "abilities" text,
  "last_used_at" datetime,
  "expires_at" datetime,
  "created_at" datetime,
  "updated_at" datetime
);
CREATE INDEX "personal_access_tokens_tokenable_type_tokenable_id_index" on "personal_access_tokens"(
  "tokenable_type",
  "tokenable_id"
);
CREATE UNIQUE INDEX "personal_access_tokens_token_unique" on "personal_access_tokens"(
  "token"
);
CREATE INDEX "personal_access_tokens_expires_at_index" on "personal_access_tokens"(
  "expires_at"
);
CREATE TABLE IF NOT EXISTS "categories"(
  "id" integer primary key autoincrement not null,
  "name" varchar not null,
  "created_at" datetime,
  "updated_at" datetime
);
CREATE TABLE IF NOT EXISTS "subcategories"(
  "id" integer primary key autoincrement not null,
  "name" varchar not null,
  "category_id" integer not null,
  "created_at" datetime,
  "updated_at" datetime,
  foreign key("category_id") references "categories"("id") on delete cascade
);
CREATE TABLE IF NOT EXISTS "products"(
  "id" integer primary key autoincrement not null,
  "name" varchar not null,
  "description" text,
  "price" numeric not null,
  "sub_category_id" integer not null,
  "created_at" datetime,
  "updated_at" datetime,
  "imagen" varchar,
  "precio_de_oferta" numeric,
  "stock" integer default '0',
  "SKU" varchar,
  foreign key("sub_category_id") references "subcategories"("id") on delete cascade
);
CREATE TABLE IF NOT EXISTS "claims"(
  "id" integer primary key autoincrement not null,
  "nombre" varchar not null,
  "email" varchar not null,
  "telefono" varchar,
  "mensaje" text not null,
  "created_at" datetime,
  "updated_at" datetime
);
CREATE TABLE IF NOT EXISTS "contacts"(
  "id" integer primary key autoincrement not null,
  "nombre" varchar not null,
  "telefono" varchar not null,
  "email" varchar not null,
  "titulo" varchar not null,
  "categoria" varchar not null,
  "mensaje" text not null,
  "leido" tinyint(1) not null default '0',
  "created_at" datetime,
  "updated_at" datetime
);
CREATE TABLE IF NOT EXISTS "banners"(
  "id" integer primary key autoincrement not null,
  "title" varchar,
  "image" varchar not null,
  "active" tinyint(1) not null default '1',
  "created_at" datetime,
  "updated_at" datetime
);
CREATE TABLE IF NOT EXISTS "testimonials"(
  "id" integer primary key autoincrement not null,
  "name" varchar not null,
  "message" text not null,
  "image" varchar not null,
  "active" tinyint(1) not null default '1',
  "created_at" datetime,
  "updated_at" datetime
);
CREATE TABLE IF NOT EXISTS "featured_category_settings"(
  "id" integer primary key autoincrement not null,
  "category_id" integer,
  "created_at" datetime,
  "updated_at" datetime,
  foreign key("category_id") references "categories"("id") on delete set null
);

INSERT INTO migrations VALUES(1,'0001_01_01_000000_create_users_table',1);
INSERT INTO migrations VALUES(2,'0001_01_01_000001_create_cache_table',1);
INSERT INTO migrations VALUES(3,'0001_01_01_000002_create_jobs_table',1);
INSERT INTO migrations VALUES(4,'2025_08_26_100418_add_two_factor_columns_to_users_table',1);
INSERT INTO migrations VALUES(5,'2025_10_04_034403_create_personal_access_tokens_table',2);
INSERT INTO migrations VALUES(6,'2025_10_04_100000_create_categories_table',3);
INSERT INTO migrations VALUES(7,'2025_10_04_100100_create_subcategories_table',3);
INSERT INTO migrations VALUES(8,'2025_10_04_100200_create_products_table',3);
INSERT INTO migrations VALUES(9,'2025_10_04_044409_add_imagen_to_products_table',4);
INSERT INTO migrations VALUES(10,'2025_10_04_045643_add_offer_fields_to_products_table',5);
INSERT INTO migrations VALUES(11,'2025_10_04_050635_create_claims_table',6);
INSERT INTO migrations VALUES(12,'2025_10_04_050635_create_contacts_table',6);
INSERT INTO migrations VALUES(13,'2025_10_04_050636_create_banners_table',6);
INSERT INTO migrations VALUES(14,'2025_10_04_050636_create_testimonials_table',6);
INSERT INTO migrations VALUES(15,'2025_11_03_051533_create_featured_category_settings_table',7);
