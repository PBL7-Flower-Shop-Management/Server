import { connectToDB } from "@/utils/database";
import bcrypt from "bcryptjs";
import AccountModel from "@/models/AccountModel";
import { sign } from "@/utils/JwtHelper";
import moment from "moment";

class AuthService {
    async GetUser(username: string, password: string) {
        return new Promise(async (resolve, reject) => {
            try {
                await connectToDB();

                const user = await AccountModel.findOne({
                    username: username,
                });
                if (!user) {
                    resolve({
                        status: 400,
                        message: "Invalid credentials",
                    });
                }

                let passwordMatches = await bcrypt.compare(
                    password,
                    user.password
                );
                if (!passwordMatches) {
                    resolve({
                        status: 400,
                        message: "Invalid credentials",
                    });
                }

                resolve({
                    status: 200,
                    data: user,
                });
            } catch (error: any) {
                reject(error);
            }
        });
    }

    async generateAuthTokens(user: any) {
        const login_time = moment();
        let accessTokenExpiresAt = login_time
            .clone()
            .add(process.env.ACCESS_TOKEN_EXPIRATION_MINUTES, "minutes");

        const access_token = await this.generateToken(
            user._id,
            login_time,
            accessTokenExpiresAt,
            "access"
        );

        let refreshTokenExpireAt = login_time
            .clone()
            .add(process.env.REFRESH_TOKEN_EXPIRATION_DAYS, "days");

        const refresh_token = await this.generateToken(
            user._id,
            login_time,
            refreshTokenExpireAt,
            "refresh"
        );
        user.refresh_token = refresh_token;
        user.refreshTokenExpireTime = refreshTokenExpireAt;
        await user.save();
        // await saveRefreshToken(user._id, login_time, refresh_token);
        return {
            access_token,
            refresh_token,
        };
    }

    async generateToken(user_id: any, login_time: any, exp: any, type: string) {
        const payload = {
            user_id,
            login_time: new Date(login_time.valueOf()).toISOString(),
            exp: exp.unix(),
            type,
        };
        let token = await sign(payload, process.env.JWT_SECRET);
        return token;
    }
}

export default new AuthService();
