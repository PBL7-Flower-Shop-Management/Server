import AccountService from "@/services/AccountService";

class AccountController {
    async GetAllAccount(query: any, userRole: string) {
        try {
            return await AccountService.GetAllAccount(query, userRole);
        } catch (error) {
            throw error;
        }
    }

    async CreateAccount(body: any, userRole: string) {
        try {
            return await AccountService.CreateAccount(body, userRole);
        } catch (error) {
            throw error;
        }
    }

    async UpdateAccount(body: any, userRole: string) {
        try {
            return await AccountService.UpdateAccount(body, userRole);
        } catch (error) {
            throw error;
        }
    }

    async LockUnLockAccount(body: any, userRole: string) {
        try {
            return await AccountService.LockUnLockAccount(body, userRole);
        } catch (error) {
            throw error;
        }
    }

    async GetAccountById(id: string, userRole: string) {
        try {
            return await AccountService.GetAccountById(id, userRole);
        } catch (error) {
            throw error;
        }
    }

    async DeleteAccount(id: string, userRole: string) {
        try {
            return await AccountService.DeleteAccount(id, userRole);
        } catch (error) {
            throw error;
        }
    }

    async DeleteAccounts(body: any, userRole: string) {
        try {
            return await AccountService.DeleteAccounts(body, userRole);
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
