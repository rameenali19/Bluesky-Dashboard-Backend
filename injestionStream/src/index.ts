import { injestionService } from "./service/injestionService.js";
import { bulkInsert } from "./service/injestionService.js";

await injestionService();
await bulkInsert();