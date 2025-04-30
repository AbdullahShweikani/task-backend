import cors from "cors";
import express, { Express } from "express";
import helmet from "helmet";
import logger from "morgan";
import { createStream } from "rotating-file-stream";

export function mainConfiguration(server: Express) {
  server.use(cors());

  server.use(express.json());

  server.use(logger("dev"));

  const accessLogStream = createStream("accessLog.log", { path: "./logs" });

  server.use(logger("combined", { stream: accessLogStream }));

  server.use(helmet());

  server.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
}
