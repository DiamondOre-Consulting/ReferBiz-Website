import { vendorRegister } from "../controllers/admin.controller.js";
import express from "express";

import isLoggedIn from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/vendor-register", isLoggedIn, vendorRegister);
export default router;
