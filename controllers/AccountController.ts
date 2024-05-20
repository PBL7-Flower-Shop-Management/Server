import AccountService from "@/services/AccountService";

class AccountController {
    async GetAllAccount(query: any) {
        try {
            return await AccountService.GetAllAccount(query);
        } catch (error) {
            throw error;
        }
    }

    async CreateAccount(body: any) {
        try {
            return await AccountService.CreateAccount(body);
        } catch (error) {
            throw error;
        }
    }

    async UpdateAccount(body: any) {
        try {
            return await AccountService.UpdateAccount(body);
        } catch (error) {
            throw error;
        }
    }

    async LockUnLockAccount(body: any) {
        try {
            return await AccountService.LockUnLockAccount(body);
        } catch (error) {
            throw error;
        }
    }

    async GetAccountById(id: string) {
        try {
            return await AccountService.GetAccountById(id);
        } catch (error) {
            throw error;
        }
    }

    async DeleteAccount(id: string) {
        try {
            return await AccountService.DeleteAccount(id);
        } catch (error) {
            throw error;
        }
    }

    async AdminResetPassword(id: string) {
        try {
            return await AccountService.AdminResetPassword(id);
        } catch (error) {
            throw error;
        }
    }
}

export default new AccountController();
