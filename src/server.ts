import express from "express";
import { config } from "dotenv";
import "../index.d.ts";
import { mainConfiguration } from "./configuration/mainConfiguration";
import { routerConfiguration } from "./configuration/routeConfiguration";
import { connectDatabase } from "./configuration/db";

config();
const PORT = process.env.PORT || 3500;

const server = express();

mainConfiguration(server);

routerConfiguration(server);

connectDatabase().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
