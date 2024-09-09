"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const routine_1 = require("../../cdk/lib/constructs/Lambda/post/routine/");
const routine_2 = require("../../cdk/lib/constructs/Lambda/get/routine/");
const routine_3 = require("../../cdk/lib/constructs/Lambda/clear/routine/");
const program_constants_json_1 = __importDefault(require("../../cdk/program.constants.json"));
const CLEARDB_SLUG = program_constants_json_1.default.CLEARDB_SLUG;
const NO_SQL_OFF_ERROR = program_constants_json_1.default.NO_SQL_OFF_ERROR;
const VPN_ON_ERROR = program_constants_json_1.default.VPN_ON_ERROR;
const health_app_1 = require("./health-app");
function printError(error_mess) {
    console.log('\x1b[41m %s \x1b[0m', "**** " + error_mess);
}
function checkNoSqlWork(response_json) {
    if (response_json.hasOwnProperty('message')) {
        const err_mess = response_json.message;
        if (err_mess.startsWith("Inaccessible host:")) {
            const prob_mess = NO_SQL_OFF_ERROR + " or " + VPN_ON_ERROR;
            printError(prob_mess);
        }
    }
}
const createApp = () => {
    const app = (0, health_app_1.healthApp)();
    const clear_db = "/" + CLEARDB_SLUG;
    app.get(clear_db, async (_req, res) => {
        try {
            const response = await (0, routine_3.dynamo_clear_handler)();
            const response_json = JSON.stringify(response);
            checkNoSqlWork(response_json);
            return res.status(200).send(response_json);
        }
        catch (e) {
            return (0, health_app_1.corsResponse)("the_e");
        }
    });
    app.get('/', async (_req, res) => {
        try {
            const response = await (0, routine_2.dynamo_get_handler)();
            const response_json = JSON.parse(response.body);
            checkNoSqlWork(response_json);
            return res.status(200).send(response_json);
        }
        catch (e) {
            return (0, health_app_1.corsResponse)("the_e");
        }
    });
    app.post('/', async (req, res) => {
        try {
            const json_data = req.body;
            const string_data = JSON.stringify(json_data);
            const response = await (0, routine_1.dynamo_post_handler)({ body: string_data });
            const response_json = JSON.parse(response.body);
            checkNoSqlWork(response_json);
            return res.status(200).send(response_json);
        }
        catch (e) {
            return (0, health_app_1.corsResponse)("the_e");
        }
    });
    return app;
};
exports.default = createApp;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlQXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY3JlYXRlQXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsMkVBQW9GO0FBQ3BGLDBFQUFrRjtBQUNsRiw0RUFBc0Y7QUFFdEYsOEZBQTZEO0FBQzdELE1BQU0sWUFBWSxHQUFHLGdDQUFhLENBQUMsWUFBWSxDQUFDO0FBQ2hELE1BQU0sZ0JBQWdCLEdBQUcsZ0NBQWEsQ0FBQyxnQkFBZ0IsQ0FBQztBQUN4RCxNQUFNLFlBQVksR0FBRyxnQ0FBYSxDQUFDLFlBQVksQ0FBQztBQUVoRCw2Q0FBdUQ7QUFFdkQsU0FBUyxVQUFVLENBQUMsVUFBa0I7SUFDcEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsRUFBRSxPQUFPLEdBQUcsVUFBVSxDQUFDLENBQUM7QUFDM0QsQ0FBQztBQUVELFNBQVMsY0FBYyxDQUFDLGFBQWtCO0lBQ3hDLElBQUksYUFBYSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDO1FBQzVDLE1BQU0sUUFBUSxHQUFHLGFBQWEsQ0FBQyxPQUFPLENBQUM7UUFDdkMsSUFBSSxRQUFRLENBQUMsVUFBVSxDQUFDLG9CQUFvQixDQUFDLEVBQUUsQ0FBQztZQUM5QyxNQUFNLFNBQVMsR0FBRyxnQkFBZ0IsR0FBRyxNQUFNLEdBQUcsWUFBWSxDQUFDO1lBQzNELFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN4QixDQUFDO0lBQ0gsQ0FBQztBQUNILENBQUM7QUFFRCxNQUFNLFNBQVMsR0FBRyxHQUFHLEVBQUU7SUFDckIsTUFBTSxHQUFHLEdBQUcsSUFBQSxzQkFBUyxHQUFFLENBQUM7SUFFeEIsTUFBTSxRQUFRLEdBQUcsR0FBRyxHQUFHLFlBQVksQ0FBQztJQUNwQyxHQUFHLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFO1FBQ3BDLElBQUksQ0FBQztZQUNILE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBQSw4QkFBb0IsR0FBRSxDQUFDO1lBQzlDLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDL0MsY0FBYyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQzlCLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDN0MsQ0FBQztRQUFDLE9BQU8sQ0FBVSxFQUFFLENBQUM7WUFDcEIsT0FBTyxJQUFBLHlCQUFZLEVBQUMsT0FBTyxDQUFDLENBQUM7UUFDL0IsQ0FBQztJQUNILENBQUMsQ0FBQyxDQUFDO0lBRUgsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsRUFBRTtRQUMvQixJQUFJLENBQUM7WUFDSCxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUEsNEJBQWtCLEdBQUUsQ0FBQztZQUM1QyxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNoRCxjQUFjLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDOUIsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUM3QyxDQUFDO1FBQUMsT0FBTyxDQUFVLEVBQUUsQ0FBQztZQUNwQixPQUFPLElBQUEseUJBQVksRUFBQyxPQUFPLENBQUMsQ0FBQztRQUMvQixDQUFDO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFFSCxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO1FBQy9CLElBQUksQ0FBQztZQUNILE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFDM0IsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUM5QyxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUEsNkJBQW1CLEVBQUMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLENBQUMsQ0FBQztZQUNsRSxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNoRCxjQUFjLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDOUIsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUM3QyxDQUFDO1FBQUMsT0FBTyxDQUFVLEVBQUUsQ0FBQztZQUNwQixPQUFPLElBQUEseUJBQVksRUFBQyxPQUFPLENBQUMsQ0FBQztRQUMvQixDQUFDO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFFSCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUMsQ0FBQztBQUNGLGtCQUFlLFNBQVMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGR5bmFtb19wb3N0X2hhbmRsZXIgfSBmcm9tICcuLi8uLi9jZGsvbGliL2NvbnN0cnVjdHMvTGFtYmRhL3Bvc3Qvcm91dGluZS8nO1xuaW1wb3J0IHsgZHluYW1vX2dldF9oYW5kbGVyIH0gZnJvbSAnLi4vLi4vY2RrL2xpYi9jb25zdHJ1Y3RzL0xhbWJkYS9nZXQvcm91dGluZS8nO1xuaW1wb3J0IHsgZHluYW1vX2NsZWFyX2hhbmRsZXIgfSBmcm9tICcuLi8uLi9jZGsvbGliL2NvbnN0cnVjdHMvTGFtYmRhL2NsZWFyL3JvdXRpbmUvJztcblxuaW1wb3J0IHRoZV9jb25zdGFudHMgZnJvbSAnLi4vLi4vY2RrL3Byb2dyYW0uY29uc3RhbnRzLmpzb24nO1xuY29uc3QgQ0xFQVJEQl9TTFVHID0gdGhlX2NvbnN0YW50cy5DTEVBUkRCX1NMVUc7XG5jb25zdCBOT19TUUxfT0ZGX0VSUk9SID0gdGhlX2NvbnN0YW50cy5OT19TUUxfT0ZGX0VSUk9SO1xuY29uc3QgVlBOX09OX0VSUk9SID0gdGhlX2NvbnN0YW50cy5WUE5fT05fRVJST1I7XG5cbmltcG9ydCB7IGhlYWx0aEFwcCwgY29yc1Jlc3BvbnNlIH0gZnJvbSAnLi9oZWFsdGgtYXBwJztcblxuZnVuY3Rpb24gcHJpbnRFcnJvcihlcnJvcl9tZXNzOiBzdHJpbmcpIHtcbiAgY29uc29sZS5sb2coJ1xceDFiWzQxbSAlcyBcXHgxYlswbScsIFwiKioqKiBcIiArIGVycm9yX21lc3MpO1xufVxuXG5mdW5jdGlvbiBjaGVja05vU3FsV29yayhyZXNwb25zZV9qc29uOiBhbnkpIHtcbiAgaWYgKHJlc3BvbnNlX2pzb24uaGFzT3duUHJvcGVydHkoJ21lc3NhZ2UnKSkge1xuICAgIGNvbnN0IGVycl9tZXNzID0gcmVzcG9uc2VfanNvbi5tZXNzYWdlO1xuICAgIGlmIChlcnJfbWVzcy5zdGFydHNXaXRoKFwiSW5hY2Nlc3NpYmxlIGhvc3Q6XCIpKSB7XG4gICAgICBjb25zdCBwcm9iX21lc3MgPSBOT19TUUxfT0ZGX0VSUk9SICsgXCIgb3IgXCIgKyBWUE5fT05fRVJST1I7XG4gICAgICBwcmludEVycm9yKHByb2JfbWVzcyk7XG4gICAgfVxuICB9XG59XG5cbmNvbnN0IGNyZWF0ZUFwcCA9ICgpID0+IHtcbiAgY29uc3QgYXBwID0gaGVhbHRoQXBwKCk7XG5cbiAgY29uc3QgY2xlYXJfZGIgPSBcIi9cIiArIENMRUFSREJfU0xVRztcbiAgYXBwLmdldChjbGVhcl9kYiwgYXN5bmMgKF9yZXEsIHJlcykgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGR5bmFtb19jbGVhcl9oYW5kbGVyKCk7XG4gICAgICBjb25zdCByZXNwb25zZV9qc29uID0gSlNPTi5zdHJpbmdpZnkocmVzcG9uc2UpO1xuICAgICAgY2hlY2tOb1NxbFdvcmsocmVzcG9uc2VfanNvbik7XG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQocmVzcG9uc2VfanNvbik7XG4gICAgfSBjYXRjaCAoZTogdW5rbm93bikge1xuICAgICAgcmV0dXJuIGNvcnNSZXNwb25zZShcInRoZV9lXCIpO1xuICAgIH1cbiAgfSk7XG5cbiAgYXBwLmdldCgnLycsIGFzeW5jIChfcmVxLCByZXMpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBkeW5hbW9fZ2V0X2hhbmRsZXIoKTtcbiAgICAgIGNvbnN0IHJlc3BvbnNlX2pzb24gPSBKU09OLnBhcnNlKHJlc3BvbnNlLmJvZHkpO1xuICAgICAgY2hlY2tOb1NxbFdvcmsocmVzcG9uc2VfanNvbik7XG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQocmVzcG9uc2VfanNvbik7XG4gICAgfSBjYXRjaCAoZTogdW5rbm93bikge1xuICAgICAgcmV0dXJuIGNvcnNSZXNwb25zZShcInRoZV9lXCIpO1xuICAgIH1cbiAgfSk7XG5cbiAgYXBwLnBvc3QoJy8nLCBhc3luYyAocmVxLCByZXMpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QganNvbl9kYXRhID0gcmVxLmJvZHk7XG4gICAgICBjb25zdCBzdHJpbmdfZGF0YSA9IEpTT04uc3RyaW5naWZ5KGpzb25fZGF0YSk7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGR5bmFtb19wb3N0X2hhbmRsZXIoeyBib2R5OiBzdHJpbmdfZGF0YSB9KTtcbiAgICAgIGNvbnN0IHJlc3BvbnNlX2pzb24gPSBKU09OLnBhcnNlKHJlc3BvbnNlLmJvZHkpO1xuICAgICAgY2hlY2tOb1NxbFdvcmsocmVzcG9uc2VfanNvbik7XG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQocmVzcG9uc2VfanNvbik7XG4gICAgfSBjYXRjaCAoZTogdW5rbm93bikge1xuICAgICAgcmV0dXJuIGNvcnNSZXNwb25zZShcInRoZV9lXCIpO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGFwcDtcbn07XG5leHBvcnQgZGVmYXVsdCBjcmVhdGVBcHA7XG5cbiJdfQ==