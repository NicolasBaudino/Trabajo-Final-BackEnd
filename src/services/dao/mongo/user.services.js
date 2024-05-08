import userModel from "../../../models/user.model.js";

export default class userDAO {
    constructor() {}

    updatePassword = async (email, password) => {
      return await userModel.findOneAndUpdate(
        { email: email },
        { password: password }
      );
    }

    getAccountByEmail = async (email) => {
      return await userModel.findOne({ email: email });
    };

    getAll = async (limit, page, query) => {
      let limitFilter = limit || 10;
      let pageFilter = page || 1;
      let queryFilter = query || "";
  
      let userPaginate = await userModel.paginate(
        {
          $or: [
            { first_name: { $regex: new RegExp(queryFilter, "i") } },
            { last_name: { $regex: new RegExp(queryFilter, "i") } },
          ],
        },
        {
          limit: limitFilter,
          page: pageFilter,
        }
      );
  
      let responseObject = {
        status: userPaginate.totalDocs > 0 ? "success" : "error",
        payload: userPaginate.docs,
        limit: userPaginate.limit,
        totalDocs: userPaginate.totalDocs,
        docsPerPage: userPaginate.docs.length,
        totalPages: userPaginate.totalPages,
        prevPage: userPaginate.prevPage,
        nextPage: userPaginate.nextPage,
        page: userPaginate.page,
        hasPrevPage: userPaginate.hasPrevPage,
        hasNextPage: userPaginate.hasNextPage,
      };
  
      return responseObject;
    };
    
    deleteInactives = async () => {
      const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
      return await userModel.deleteMany({ last_connection: { $lt: twoDaysAgo } });
    };

    getAccountById = async (id) => {
      return await userModel.findOne({ _id: id });
    };

    updateAccount = async (id, account) => {
      return await userModel.findByIdAndUpdate(id, account);
    };

    deleteAccount = async (id) => {
      return await userModel.findByIdAndDelete(id);
    };
}