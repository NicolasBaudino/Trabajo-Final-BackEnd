import { Router } from "express";
import { passportCall, uploader } from "../utils.js";
import passport from "passport";
import UserDto from "../services/dto/user.dto.js";
import { hasAdminPermission } from "../middlewares/permissions.middleware.js";
import { deleteInactivesController, documentsController, getAllUsersController, premiumController, getUserByIdController, getAccountByEmailController, deleteAccountController, updateAccountController } from "../controllers/user.controller.js";

const router = Router();

router.get("/login", (req, res) => {
    res.render("login.hbs");
});

router.get("/register", (req, res) => {
    res.render("register.hbs");
});

router.get("/send-email-to-recover", async (req, res) => {
    res.render("sendEmail.hbs");
});

router.get("/new-password/:token", async (req, res) => {
    const { token } = req.params;
  
    res.render("newPassword.hbs", {
      token
    });
});

// passport.authenticate('jwt', {session: false})
// authorization("admin")
router.get("/profile", passportCall('jwt'), (req,res)=>{
    res.render('profile.hbs', { user: new UserDto(req.user) })
});

router.get("/error", (req, res) => {
    res.render("error");
});

// router.get("/:id", (req, res) => {
//     res.render("users.hbs");
// });

router.get("/premium/:uid", uploader.array('documents'), premiumController)

router.post("/:uid/documents", uploader.array('documents'), documentsController);

router.get("/", getAllUsersController);

router.delete("/", deleteInactivesController);

router.get("/:id", hasAdminPermission(), getUserByIdController);

router.get("/email/:email", getAccountByEmailController);

router.put("/:id", hasAdminPermission(), updateAccountController);

router.delete("/:id", hasAdminPermission(), deleteAccountController);

export default router;