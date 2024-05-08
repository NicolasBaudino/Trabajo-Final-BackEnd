import { Router } from "express";
import { generateFakeProduct } from "../utils.js";
import logger from "../config/logger.js";

const router = Router();

router.get("/mockingproducts", (req, res) => {
  const mockProductsArray = [];

  for (let i = 0; i < 100; i++) {
    mockProductsArray.push(generateFakeProduct());
  }

  res.status(200).json({ message: "OK", products: mockProductsArray });
});

router.get("/loggertest", (req, res) => {
  logger.debug("Debug logger test");
  logger.http("http logger test");
  logger.info("Info logger test");
  logger.warning("Warn logger test");
  logger.error("Error logger test");
  logger.fatal("Fatal logger test");

  res.send("Log test executed");
});

export default router;