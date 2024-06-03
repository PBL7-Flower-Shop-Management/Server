import AuthService from "@/services/AuthService";
import { OAuth2Client } from "google-auth-library";
class AuthController {
    async Register(body: any) {
        try {
            return await AuthService.Register(body);
            // confirmationUserService.createConfirmationTokenAndSendMail(
            //     newUser._id
            // );
        } catch (error) {
            throw error;
        }
    }

    async Login(body: any) {
        try {
            const { username, password } = body;
            return await AuthService.Login(username, password);
        } catch (error) {
            throw error;
        }
    }

    oAuth2Client = new OAuth2Client(
        process.env.GOOGLE_ID,
        process.env.GOOGLE_SECRET
    );

    private async verifyGoogleToken(token: string) {
        try {
            const ticket = await this.oAuth2Client.verifyIdToken({
                idToken: token,
                audience: [
                    process.env.GOOGLE_ID_IOS!,
                    process.env.GOOGLE_ID_ANDROID!,
                ],
            });
            return { payload: ticket.getPayload() };
        } catch (error) {
            throw error;
        }
    }

    async GoogleLogin(accessToken: string) {
        try {
            const verificationResponse = await this.verifyGoogleToken(
                accessToken
            );

            const profile = verificationResponse?.payload;
            return await AuthService.HandleGoogleUser(profile);
        } catch (error) {
            throw error;
        }
    }

    async RefreshToken(body: any) {
        try {
            return await AuthService.RefreshToken(body);
        } catch (error) {
            throw error;
        }
    }
}

const authController = new AuthController();
export default authController;
