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

    private async verifyGoogleToken(token: any) {
        try {
            const ticket = await this.oAuth2Client.verifyIdToken({
                idToken: token,
                audience: [
                    process.env.GOOGLE_ID!,
                    // process.env.CLIENT_ID_ANDROID!,
                ],
            });
            return { payload: ticket.getPayload() };
        } catch (error) {
            throw error;
        }
    }

    async GoogleLogin(body: any) {
        try {
            if (body.credential) {
                const verificationResponse = await this.verifyGoogleToken(
                    body.credential
                );

                const profile = verificationResponse?.payload;
                return await AuthService.HandleGoogleUser(profile);
            }
        } catch (error) {
            throw error;
        }
    }
}

export default new AuthController();
