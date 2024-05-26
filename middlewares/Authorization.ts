import AccountModel from "@/models/AccountModel";
import ApiResponse from "@/utils/ApiResponse";
import { connectToDB } from "@/utils/database";
import { verify } from "@/utils/JwtHelper";
import httpStatus from "http-status";
import { headers } from "next/headers";

const auth = async (next: any) => {
    try {
        const authHeader = headers().get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return new ApiResponse({
                status: httpStatus.UNAUTHORIZED,
                message: "Invalid access token",
            });
        }

        let accessToken = authHeader.split(" ")[1];
        const userToken = await verify(accessToken, process.env.JWT_SECRET);

        if (!userToken)
            return new ApiResponse({
                status: httpStatus.UNAUTHORIZED,
                message: "Invalid access token",
            });

        await connectToDB();
        const acc = await AccountModel.findOne({
            userId: userToken.user._id,
        });

        if (
            !acc ||
            Math.floor(acc.tokenExpireTime.getTime() / 1000) !== userToken.exp
        )
            return new ApiResponse({
                status: httpStatus.UNAUTHORIZED,
                message: "Invalid access token",
            });

        if (acc.isDeleted || !acc.isActived)
            return new ApiResponse({
                status: httpStatus.FORBIDDEN,
                message:
                    "Your account has been deleted or has not been activated",
            });

        // if (
        //     !(await UserModel.findOne({
        //         _id: userToken.user_id,
        //         isDeleted: false,
        //     })) ||
        //     !(await AccountModel.findOne({
        //         userId: userToken.user_id,
        //         isDeleted: false,
        //         isActived: true,
        //     }))
        // )
        //     return new ApiResponse({
        //         status: httpStatus.UNAUTHORIZED,
        //         message: "Account has been deleted or locked",
        //     });

        userToken.user.username = acc.username;
        return next(userToken);
    } catch (error) {
        throw error;
    }
};

const checkRole = (roles: any[]) => async (userToken: any, next: any) => {
    try {
        if (!roles.includes(userToken.user.role)) {
            return new ApiResponse({
                status: httpStatus.FORBIDDEN,
                message: "You do not have access to this route",
            });
        }

        return next();
    } catch (error) {
        throw error;
    }
};

export { auth, checkRole };
