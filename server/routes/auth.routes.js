import {
  register,
  login,
  logout,
  profile,
} from "../controllers/auth.controller.js";
import isLoggedIn from "../middlewares/auth.middleware.js";
import { Router } from "express";
const router = Router();
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/", isLoggedIn, profile);

export default router;
