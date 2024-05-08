export default class userRepository {
    constructor(dao) {
      this.dao = dao;
    }
    
    updatePassword = async (email, password) => {
        return await this.dao.updatePassword(email, password);
    };

    getAccountByEmail = async (email) => {
      return await this.dao.getAccountByEmail(email);
    };

    getAll = async (limit, page, query) => {
      return await this.dao.getAll(limit, page, query);
    };

    getAccountById = async (id) => {
      return await this.dao.getAccountById(id);
    };

    updateAccount = async (id, account) => {
      return await this.dao.updateAccount(id, account);
    };

    deleteAccount = async (id) => {
      return await this.dao.deleteAccount(id);
    };

    deleteInactives = async () => {
      return await this.dao.deleteInactives();
    };
}