import AccountService from "@/services/AccountService";

class AccountController {
    async CreateAccount(body: any) {
        try {
            return await AccountService.CreateAccount(body);
        } catch (error) {
            throw error;
        }
    }
}

export default new AccountController();
