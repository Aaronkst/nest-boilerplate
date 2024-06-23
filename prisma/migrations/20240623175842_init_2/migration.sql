-- AlterTable
ALTER TABLE "admin" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "refresh_token" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "refresh_token" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "admin_id_email_idx" ON "admin"("id", "email");

-- CreateIndex
CREATE INDEX "auth_user_id_admin_id_idx" ON "auth"("user_id", "admin_id");

-- CreateIndex
CREATE INDEX "users_id_email_idx" ON "users"("id", "email");
