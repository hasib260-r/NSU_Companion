-- CreateTable
CREATE TABLE "menu_items" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "stall" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "prepTimeMinutes" INTEGER NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "menu_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "menu_items_stall_idx" ON "menu_items"("stall");

-- CreateIndex
CREATE INDEX "menu_items_category_idx" ON "menu_items"("category");
