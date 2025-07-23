import { Module } from "@nestjs/common";
import { DatabaseRouter } from "./database-router";

@Module({
  providers: [DatabaseRouter],
  exports: [DatabaseRouter],
})
export class DatabaseRouterModule {}
