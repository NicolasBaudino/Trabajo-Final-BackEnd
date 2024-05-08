import { Router } from "express";
import { getProductsController, getProductByIdController, addProductController, updateProductController, deleteProductController } from "../controllers/products.controller.js";
import { hasAdminPermission } from "../middlewares/permissions.middleware.js";
import { passportCall, uploader } from "../utils.js";

const router = Router();

router.get('/', getProductsController);

router.get('/:pid', getProductByIdController);

router.post('/', passportCall('jwt'), hasAdminPermission(), uploader.single('thumbnail'), addProductController);

router.put('/:pid', passportCall('jwt'), hasAdminPermission(), uploader.any(), updateProductController);

router.delete('/:pid', passportCall('jwt'), hasAdminPermission(), deleteProductController);

export default router;