"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthApp = void 0;
exports.corsResponse = corsResponse;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routine_1 = require("../../cicd/lib/constructs/Lambda/healthcheck/routine/");
const program_constants_json_1 = __importDefault(require("../../cicd/program.constants.json"));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhbHRoLWFwcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImhlYWx0aC1hcHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBU0Esb0NBV0M7QUFuQkQsc0RBQThCO0FBQzlCLGdEQUF3QjtBQUV4QixtRkFBNEY7QUFDNUYsK0ZBQThEO0FBQzlELE1BQU0saUJBQWlCLEdBQUcsZ0NBQWEsQ0FBQyxpQkFBaUIsQ0FBQztBQUMxRCxNQUFNLFlBQVksR0FBRyxHQUFHLEdBQUcsaUJBQWlCLENBQUM7QUFFN0MsU0FBZ0IsWUFBWSxDQUFDLFlBQW9CO0lBQy9DLE1BQU0sU0FBUyxHQUFHO1FBQ2hCLFVBQVUsRUFBRSxHQUFHO1FBQ2YsT0FBTyxFQUFFO1lBQ1AsOEJBQThCLEVBQUUsY0FBYztZQUM5Qyw2QkFBNkIsRUFBRSxHQUFHO1lBQ2xDLDhCQUE4QixFQUFFLEtBQUs7U0FDdEM7UUFDRCxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsQ0FBQztLQUNoRCxDQUFDO0lBQ0YsT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQztBQUVNLE1BQU0sU0FBUyxHQUFHLEdBQUcsRUFBRTtJQUM1QixNQUFNLEdBQUcsR0FBRyxJQUFBLGlCQUFPLEdBQUUsQ0FBQztJQUN0QixHQUFHLENBQUMsR0FBRyxDQUFDLElBQUEsY0FBSSxHQUFFLENBQUMsQ0FBQztJQUNoQixHQUFHLENBQUMsR0FBRyxDQUFDLGlCQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUN4QixHQUFHLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFO1FBQ3hDLElBQUksQ0FBQztZQUNILE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBQSw2QkFBbUIsR0FBRSxDQUFDO1lBQzdDLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDL0MsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUM3QyxDQUFDO1FBQUMsT0FBTyxDQUFVLEVBQUUsQ0FBQztZQUNwQixPQUFPLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMvQixDQUFDO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDSCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUMsQ0FBQztBQWRXLFFBQUEsU0FBUyxhQWNwQiIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgY29ycyBmcm9tICdjb3JzJztcblxuaW1wb3J0IHsgaGVhbHRoY2hlY2tfaGFuZGxlciB9IGZyb20gJy4uLy4uL2NpY2QvbGliL2NvbnN0cnVjdHMvTGFtYmRhL2hlYWx0aGNoZWNrL3JvdXRpbmUvJztcbmltcG9ydCB0aGVfY29uc3RhbnRzIGZyb20gJy4uLy4uL2NpY2QvcHJvZ3JhbS5jb25zdGFudHMuanNvbic7XG5jb25zdCBIRUFMVEhfQ0hFQ0tfU0xVRyA9IHRoZV9jb25zdGFudHMuSEVBTFRIX0NIRUNLX1NMVUc7XG5jb25zdCBoZWFsdGhfY2hlY2sgPSBcIi9cIiArIEhFQUxUSF9DSEVDS19TTFVHO1xuXG5leHBvcnQgZnVuY3Rpb24gY29yc1Jlc3BvbnNlKHRoZV9yZXNwb25zZTogc3RyaW5nKSB7XG4gIGNvbnN0IGNvcnNfcmVzcCA9IHtcbiAgICBzdGF0dXNDb2RlOiAyMDAsXG4gICAgaGVhZGVyczoge1xuICAgICAgXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzXCI6IFwiQ29udGVudC1UeXBlXCIsXG4gICAgICBcIkFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpblwiOiBcIipcIixcbiAgICAgIFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kc1wiOiBcIkdFVFwiXG4gICAgfSxcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IG1lc3NhZ2U6IHRoZV9yZXNwb25zZSB9KSxcbiAgfTtcbiAgcmV0dXJuIGNvcnNfcmVzcDtcbn1cblxuZXhwb3J0IGNvbnN0IGhlYWx0aEFwcCA9ICgpID0+IHtcbiAgY29uc3QgYXBwID0gZXhwcmVzcygpO1xuICBhcHAudXNlKGNvcnMoKSk7XG4gIGFwcC51c2UoZXhwcmVzcy5qc29uKCkpO1xuICBhcHAuZ2V0KGhlYWx0aF9jaGVjaywgYXN5bmMgKF9yZXEsIHJlcykgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGhlYWx0aGNoZWNrX2hhbmRsZXIoKTtcbiAgICAgIGNvbnN0IHJlc3BvbnNlX2pzb24gPSBKU09OLnN0cmluZ2lmeShyZXNwb25zZSk7XG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQocmVzcG9uc2VfanNvbik7XG4gICAgfSBjYXRjaCAoZTogdW5rbm93bikge1xuICAgICAgcmV0dXJuIGNvcnNSZXNwb25zZShcInRoZV9lXCIpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBhcHA7XG59O1xuIl19