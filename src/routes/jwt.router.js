import { Router } from 'express';
import passport from 'passport';
import { uploader } from '../utils.js';
import { loginController, logoutController, newPasswordController, recoverPasswordController, registerController } from '../controllers/jwt.controller.js';


const router = Router();

router.post("/login", loginController);

router.post('/register', uploader.single('avatar'), passport.authenticate('register', { session: false }), registerController);

router.post("/recover-password", recoverPasswordController)

router.post("/new-password/:token", newPasswordController)

router.get("/logout", logoutController);

export default router;