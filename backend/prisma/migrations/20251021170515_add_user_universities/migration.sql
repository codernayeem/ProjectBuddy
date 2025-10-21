-- CreateEnum
CREATE TYPE "UniversityStatus" AS ENUM ('CURRENT', 'GRADUATED');

-- CreateTable
CREATE TABLE "user_universities" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "universityName" TEXT NOT NULL,
    "status" "UniversityStatus" NOT NULL DEFAULT 'CURRENT',
    "startYear" INTEGER,
    "endYear" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_universities_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_universities" ADD CONSTRAINT "user_universities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
