import express from "express";
import { LineChartData } from "../Controller/graph.controller.js";
const graphRouter = express.Router();

graphRouter.get("/:module",LineChartData);

export default graphRouter;
