-- CreateTable
CREATE TABLE "favorite_takes" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "takeId" INTEGER NOT NULL,

    CONSTRAINT "favorite_takes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "favorite_takes_userId_idx" ON "favorite_takes"("userId");

-- CreateIndex
CREATE INDEX "favorite_takes_takeId_idx" ON "favorite_takes"("takeId");

-- CreateIndex
CREATE UNIQUE INDEX "favorite_takes_userId_takeId_key" ON "favorite_takes"("userId", "takeId");

-- AddForeignKey
ALTER TABLE "favorite_takes" ADD CONSTRAINT "favorite_takes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_takes" ADD CONSTRAINT "favorite_takes_takeId_fkey" FOREIGN KEY ("takeId") REFERENCES "takes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
