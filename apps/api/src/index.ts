import { createApp } from "./app.js";
import { loadConfig } from "./config.js";
import { databaseFromConfig } from "./database/client.js";

const config = loadConfig();
const app = createApp({ config, db: databaseFromConfig(config) });

app.listen(config.PORT, () => {
  console.log(`BellGrinda API listening on port ${config.PORT}`);
});
