/*
  Warnings:

  - You are about to drop the column `isDefault` on the `team_custom_roles` table. All the data in the column will be lost.
  - You are about to drop the column `permissions` on the `team_custom_roles` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `team_custom_roles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "team_custom_roles" DROP COLUMN "isDefault",
DROP COLUMN "permissions",
DROP COLUMN "priority",
ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;
