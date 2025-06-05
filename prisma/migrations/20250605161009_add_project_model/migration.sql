/*
  Warnings:

  - Added the required column `idProject` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "idProject" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_idProject_fkey" FOREIGN KEY ("idProject") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
