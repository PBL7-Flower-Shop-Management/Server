import { NextRequest } from "next/server";
// import Ajv from "ajv";

// let ajv = Ajv({ allErrors: true });

// // validation middleware
// let validateSchema = (parameters: any) => {
//     return (req: any, res: any, next: any) => {
//         if (parameters) {
//             let errors: any[] = [];
//             parameters.forEach((param: any) => {
//                 let valid = ajv.validate(
//                     parameters[param].schema,
//                     req.body[param]
//                 );
//                 if (!valid) {
//                     errors.push(ajv.errors);
//                 }
//             });
//             if (errors.length) return res.send(errors);
//         }
//         next();
//     };
// };

export function middleware(request: NextRequest) {
    // console.log("params", request.nextUrl.searchParams);
    // return validateSchema(request.nextUrl.searchParams)(
    //     request,
    //     undefined,
    //     () => {}
    // );
}
