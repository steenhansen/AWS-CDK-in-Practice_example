export declare function corsResponse(the_response: string): {
    statusCode: number;
    headers: {
        "Access-Control-Allow-Headers": string;
        "Access-Control-Allow-Origin": string;
        "Access-Control-Allow-Methods": string;
    };
    body: string;
};
export declare const healthApp: () => import("express-serve-static-core").Express;
