import userModel from "../models/user.model.js";
import UserDto from "../services/dto/user.dto.js";
import { userService } from "../services/service.js";

export const premiumController = async (req, res) => {
    try {
        const files = req.files;
        const userId = req.params.uid;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).send("User not found");
        }

        if (!req.files){
            return res.status(400).send({ status: "error", message: "No files were attached"})
        }
        
        if (req.files.length !== 3){
            return res.status(400).send({ status: "error", message: "You must attach exactly 3 files"})
        }

        const documents = files.map(file => ({
            name: file.filename, 
            reference: file.path
        }));

        user.documents = [...user.documents, ...documents]

        user.role = user.role === 'user' ? 'premium' : 'user';

        await user.save();

        res.render('profile', { user: new UserDto(user) });
    } catch (error) {
        console.error("Error at changing user role:", error);
        res.status(500).send("Internal server error");
    }
}

export const documentsController = async (req, res) => {
    try{
        const files = req.files;
        const userId = req.params.uid;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).send("User not found");
        }

        if (!req.files){
            return res.status(400).send({ status: "error", message: "No file attached"})
        }

        const documents = files.map(file => ({
            name: file.filename, 
            reference: file.path
        }));

        user.documents = [...user.documents, ...documents]

        await user.save();
        return res.status(200).send({ status: "successful", message: "Uploaded file"})
    }
    catch (error) {
        console.error("Error at adding a file: ", error);
        res.status(500).send("Internal server error");
    }
}

export const getAllUsersController = async (req, res) => {
    const { limit, page, query } = req.query;
    try {
        const users = await userService.getAll(limit, page, query);
        const usersDTOs = users.payload.map((user) => new UserDto(user));
        res.status(200).json({
        success: true,
        users: usersDTOs,
        limit: users.limit,
        totalDocs: users.totalDocs,
        docsPerPage: users.docsPerPage,
        totalPages: users.totalPages,
        prevPage: users.prevPage,
        nextPage: users.nextPage,
        page: users.page,
        hasPrevPage: users.hasPrevPage,
        hasNextPage: users.hasNextPage,
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}

export const getUserByIdController = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await userService.getAccountById(id);
      if (!user) {
        res.status(404).json({ success: false, message: "User not found" });
      }
      const userDTO = new UserDto(user);
      res.status(200).render("users.hbs", { success: true, user: userDTO });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
};
  
export const getAccountByEmailController = async (req, res) => {
    try {
        const { email } = req.params;
        const account = await userService.getAccountByEmail(email);
        if (!account) {
        res.status(401).json({ success: false, message: "Invalid Credentials" });
        }
        const userDTO = new UserDto(account);
        res.status(200).json({ success: true, data: userDTO });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
  
export const updateAccountController = async (req, res) => {
    try {
      const { id } = req.params;
      const newValues = req.body;
      const accountUpdated = await userService.updateAccount(id, newValues);
      if (accountUpdated.modifiedCount === 0) {
        return res.status(404).json({
          success: false,
          message:
            "No changes were made, as the received values are the same as those stored",
        });
      }
      res.status(200).json({ success: true, data: accountUpdated });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
};
  
export const deleteAccountController = async (req, res) => {
    try {
      const { id } = req.params;
      const accountDeleted = await userService.deleteAccount(id);
      console.log(accountDeleted);
      if (accountDeleted.deletedCount === 0) {
        return res
          .status(404)
          .json({ success: false, message: "No account was deleted" });
      }
      res.status(200).json({ success: true, data: accountDeleted });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
};

export const deleteInactivesController = async (req, res) => {
    try {
      const deletedInactives = await userService.deleteInactives();
      if (deletedInactives.deletedCount === 0) {
        return res
          .status(404)
          .json({ success: false, message: "No accounts were deleted" });
      }
      res.status(200).json({ success: true, data: deletedInactives });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
}
