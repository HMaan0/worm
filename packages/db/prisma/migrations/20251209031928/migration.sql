-- CreateTable
CREATE TABLE "Personality" (
    "id" SERIAL NOT NULL,
    "casualness" INTEGER NOT NULL,
    "verbosity" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Personality_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Knowledge" (
    "id" SERIAL NOT NULL,
    "customBaseOn" BOOLEAN NOT NULL DEFAULT false,
    "websitesOn" BOOLEAN NOT NULL DEFAULT false,
    "customContext" TEXT NOT NULL DEFAULT '',
    "websiteLink" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Knowledge_pkey" PRIMARY KEY ("id")
);
