"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthApp = void 0;
exports.corsResponse = corsResponse;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routine_1 = require("../../cdk/lib/constructs/Lambda/healthcheck/routine/");
const program_constants_json_1 = __importDefault(require("../../cdk/program.constants.json"));
const HEALTH_CHECK_SLUG = program_constants_json_1.default.HEALTH_CHECK_SLUG;
const health_check = "/" + HEALTH_CHECK_SLUG;
function corsResponse(the_response) {
    const cors_resp = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET"
        },
        body: JSON.stringify({ message: the_response }),
    };
    return cors_resp;
}
const healthApp = () => {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.get(health_check, async (_req, res) => {
        try {
            const response = await (0, routine_1.healthcheck_handler)();
            const response_json = JSON.stringify(response);
            return res.status(200).send(response_json);
        }
        catch (e) {
            return corsResponse("the_e");
        }
    });
    return app;
};
exports.healthApp = healthApp;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhbHRoLWFwcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImhlYWx0aC1hcHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBU0Esb0NBV0M7QUFuQkQsc0RBQThCO0FBQzlCLGdEQUF3QjtBQUV4QixrRkFBMkY7QUFDM0YsOEZBQTZEO0FBQzdELE1BQU0saUJBQWlCLEdBQUcsZ0NBQWEsQ0FBQyxpQkFBaUIsQ0FBQztBQUMxRCxNQUFNLFlBQVksR0FBRyxHQUFHLEdBQUcsaUJBQWlCLENBQUM7QUFFN0MsU0FBZ0IsWUFBWSxDQUFDLFlBQW9CO0lBQy9DLE1BQU0sU0FBUyxHQUFHO1FBQ2hCLFVBQVUsRUFBRSxHQUFHO1FBQ2YsT0FBTyxFQUFFO1lBQ1AsOEJBQThCLEVBQUUsY0FBYztZQUM5Qyw2QkFBNkIsRUFBRSxHQUFHO1lBQ2xDLDhCQUE4QixFQUFFLEtBQUs7U0FDdEM7UUFDRCxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsQ0FBQztLQUNoRCxDQUFDO0lBQ0YsT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQztBQUVNLE1BQU0sU0FBUyxHQUFHLEdBQUcsRUFBRTtJQUM1QixNQUFNLEdBQUcsR0FBRyxJQUFBLGlCQUFPLEdBQUUsQ0FBQztJQUN0QixHQUFHLENBQUMsR0FBRyxDQUFDLElBQUEsY0FBSSxHQUFFLENBQUMsQ0FBQztJQUNoQixHQUFHLENBQUMsR0FBRyxDQUFDLGlCQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUN4QixHQUFHLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFO1FBQ3hDLElBQUksQ0FBQztZQUNILE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBQSw2QkFBbUIsR0FBRSxDQUFDO1lBQzdDLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDL0MsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUM3QyxDQUFDO1FBQUMsT0FBTyxDQUFVLEVBQUUsQ0FBQztZQUNwQixPQUFPLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMvQixDQUFDO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDSCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUMsQ0FBQztBQWRXLFFBQUEsU0FBUyxhQWNwQiIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgY29ycyBmcm9tICdjb3JzJztcblxuaW1wb3J0IHsgaGVhbHRoY2hlY2tfaGFuZGxlciB9IGZyb20gJy4uLy4uL2Nkay9saWIvY29uc3RydWN0cy9MYW1iZGEvaGVhbHRoY2hlY2svcm91dGluZS8nO1xuaW1wb3J0IHRoZV9jb25zdGFudHMgZnJvbSAnLi4vLi4vY2RrL3Byb2dyYW0uY29uc3RhbnRzLmpzb24nO1xuY29uc3QgSEVBTFRIX0NIRUNLX1NMVUcgPSB0aGVfY29uc3RhbnRzLkhFQUxUSF9DSEVDS19TTFVHO1xuY29uc3QgaGVhbHRoX2NoZWNrID0gXCIvXCIgKyBIRUFMVEhfQ0hFQ0tfU0xVRztcblxuZXhwb3J0IGZ1bmN0aW9uIGNvcnNSZXNwb25zZSh0aGVfcmVzcG9uc2U6IHN0cmluZykge1xuICBjb25zdCBjb3JzX3Jlc3AgPSB7XG4gICAgc3RhdHVzQ29kZTogMjAwLFxuICAgIGhlYWRlcnM6IHtcbiAgICAgIFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVyc1wiOiBcIkNvbnRlbnQtVHlwZVwiLFxuICAgICAgXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW5cIjogXCIqXCIsXG4gICAgICBcIkFjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHNcIjogXCJHRVRcIlxuICAgIH0sXG4gICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBtZXNzYWdlOiB0aGVfcmVzcG9uc2UgfSksXG4gIH07XG4gIHJldHVybiBjb3JzX3Jlc3A7XG59XG5cbmV4cG9ydCBjb25zdCBoZWFsdGhBcHAgPSAoKSA9PiB7XG4gIGNvbnN0IGFwcCA9IGV4cHJlc3MoKTtcbiAgYXBwLnVzZShjb3JzKCkpO1xuICBhcHAudXNlKGV4cHJlc3MuanNvbigpKTtcbiAgYXBwLmdldChoZWFsdGhfY2hlY2ssIGFzeW5jIChfcmVxLCByZXMpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBoZWFsdGhjaGVja19oYW5kbGVyKCk7XG4gICAgICBjb25zdCByZXNwb25zZV9qc29uID0gSlNPTi5zdHJpbmdpZnkocmVzcG9uc2UpO1xuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHJlc3BvbnNlX2pzb24pO1xuICAgIH0gY2F0Y2ggKGU6IHVua25vd24pIHtcbiAgICAgIHJldHVybiBjb3JzUmVzcG9uc2UoXCJ0aGVfZVwiKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gYXBwO1xufTtcbiJdfQ==