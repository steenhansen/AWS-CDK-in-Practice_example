"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const routine_1 = require("../../cicd/lib/constructs/Lambda/post/routine/");
const routine_2 = require("../../cicd/lib/constructs/Lambda/get/routine/");
const routine_3 = require("../../cicd/lib/constructs/Lambda/clear/routine/");
const env_errors_1 = require("../../cicd/utils/env-errors");
const program_constants_json_1 = __importDefault(require("../../cicd/program.constants.json"));
const CLEARDB_SLUG = program_constants_json_1.default.CLEARDB_SLUG;
const NO_SQL_OFF_ERROR = program_constants_json_1.default.NO_SQL_OFF_ERROR;
const VPN_ON_ERROR = program_constants_json_1.default.VPN_ON_ERROR;
const health_app_1 = require("./health-app");
function checkNoSqlWork(response_json) {
    if (response_json.hasOwnProperty('message')) {
        const err_mess = response_json.message;
        if (err_mess.startsWith("Inaccessible host:")) {
            const error_mess = NO_SQL_OFF_ERROR + " or " + VPN_ON_ERROR;
            (0, env_errors_1.printError)(error_mess, 'server/src/createApp.ts', err_mess);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlQXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY3JlYXRlQXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBSUEsNEVBQXFGO0FBQ3JGLDJFQUFtRjtBQUNuRiw2RUFBdUY7QUFHdkYsNERBQXlEO0FBRXpELCtGQUE4RDtBQUM5RCxNQUFNLFlBQVksR0FBRyxnQ0FBYSxDQUFDLFlBQVksQ0FBQztBQUNoRCxNQUFNLGdCQUFnQixHQUFHLGdDQUFhLENBQUMsZ0JBQWdCLENBQUM7QUFDeEQsTUFBTSxZQUFZLEdBQUcsZ0NBQWEsQ0FBQyxZQUFZLENBQUM7QUFFaEQsNkNBQXVEO0FBR3ZELFNBQVMsY0FBYyxDQUFDLGFBQWtCO0lBQ3hDLElBQUksYUFBYSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDO1FBQzVDLE1BQU0sUUFBUSxHQUFHLGFBQWEsQ0FBQyxPQUFPLENBQUM7UUFDdkMsSUFBSSxRQUFRLENBQUMsVUFBVSxDQUFDLG9CQUFvQixDQUFDLEVBQUUsQ0FBQztZQUM5QyxNQUFNLFVBQVUsR0FBRyxnQkFBZ0IsR0FBRyxNQUFNLEdBQUcsWUFBWSxDQUFDO1lBQzVELElBQUEsdUJBQVUsRUFBQyxVQUFVLEVBQUUseUJBQXlCLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDOUQsQ0FBQztJQUNILENBQUM7QUFDSCxDQUFDO0FBRUQsTUFBTSxTQUFTLEdBQUcsR0FBRyxFQUFFO0lBQ3JCLE1BQU0sR0FBRyxHQUFHLElBQUEsc0JBQVMsR0FBRSxDQUFDO0lBRXhCLE1BQU0sUUFBUSxHQUFHLEdBQUcsR0FBRyxZQUFZLENBQUM7SUFDcEMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsRUFBRTtRQUNwQyxJQUFJLENBQUM7WUFDSCxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUEsOEJBQW9CLEdBQUUsQ0FBQztZQUM5QyxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQy9DLGNBQWMsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUM5QixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzdDLENBQUM7UUFBQyxPQUFPLENBQVUsRUFBRSxDQUFDO1lBQ3BCLE9BQU8sSUFBQSx5QkFBWSxFQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQy9CLENBQUM7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUVILEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEVBQUU7UUFDL0IsSUFBSSxDQUFDO1lBQ0gsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFBLDRCQUFrQixHQUFFLENBQUM7WUFDNUMsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDaEQsY0FBYyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQzlCLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDN0MsQ0FBQztRQUFDLE9BQU8sQ0FBVSxFQUFFLENBQUM7WUFDcEIsT0FBTyxJQUFBLHlCQUFZLEVBQUMsT0FBTyxDQUFDLENBQUM7UUFDL0IsQ0FBQztJQUNILENBQUMsQ0FBQyxDQUFDO0lBRUgsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtRQUMvQixJQUFJLENBQUM7WUFDSCxNQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO1lBQzNCLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDOUMsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFBLDZCQUFtQixFQUFDLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUM7WUFDbEUsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDaEQsY0FBYyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQzlCLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDN0MsQ0FBQztRQUFDLE9BQU8sQ0FBVSxFQUFFLENBQUM7WUFDcEIsT0FBTyxJQUFBLHlCQUFZLEVBQUMsT0FBTyxDQUFDLENBQUM7UUFDL0IsQ0FBQztJQUNILENBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDLENBQUM7QUFDRixrQkFBZSxTQUFTLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcblxuXG5cbmltcG9ydCB7IGR5bmFtb19wb3N0X2hhbmRsZXIgfSBmcm9tICcuLi8uLi9jaWNkL2xpYi9jb25zdHJ1Y3RzL0xhbWJkYS9wb3N0L3JvdXRpbmUvJztcbmltcG9ydCB7IGR5bmFtb19nZXRfaGFuZGxlciB9IGZyb20gJy4uLy4uL2NpY2QvbGliL2NvbnN0cnVjdHMvTGFtYmRhL2dldC9yb3V0aW5lLyc7XG5pbXBvcnQgeyBkeW5hbW9fY2xlYXJfaGFuZGxlciB9IGZyb20gJy4uLy4uL2NpY2QvbGliL2NvbnN0cnVjdHMvTGFtYmRhL2NsZWFyL3JvdXRpbmUvJztcblxuXG5pbXBvcnQgeyBwcmludEVycm9yIH0gZnJvbSAnLi4vLi4vY2ljZC91dGlscy9lbnYtZXJyb3JzJztcblxuaW1wb3J0IHRoZV9jb25zdGFudHMgZnJvbSAnLi4vLi4vY2ljZC9wcm9ncmFtLmNvbnN0YW50cy5qc29uJztcbmNvbnN0IENMRUFSREJfU0xVRyA9IHRoZV9jb25zdGFudHMuQ0xFQVJEQl9TTFVHO1xuY29uc3QgTk9fU1FMX09GRl9FUlJPUiA9IHRoZV9jb25zdGFudHMuTk9fU1FMX09GRl9FUlJPUjtcbmNvbnN0IFZQTl9PTl9FUlJPUiA9IHRoZV9jb25zdGFudHMuVlBOX09OX0VSUk9SO1xuXG5pbXBvcnQgeyBoZWFsdGhBcHAsIGNvcnNSZXNwb25zZSB9IGZyb20gJy4vaGVhbHRoLWFwcCc7XG5cblxuZnVuY3Rpb24gY2hlY2tOb1NxbFdvcmsocmVzcG9uc2VfanNvbjogYW55KSB7XG4gIGlmIChyZXNwb25zZV9qc29uLmhhc093blByb3BlcnR5KCdtZXNzYWdlJykpIHtcbiAgICBjb25zdCBlcnJfbWVzcyA9IHJlc3BvbnNlX2pzb24ubWVzc2FnZTtcbiAgICBpZiAoZXJyX21lc3Muc3RhcnRzV2l0aChcIkluYWNjZXNzaWJsZSBob3N0OlwiKSkge1xuICAgICAgY29uc3QgZXJyb3JfbWVzcyA9IE5PX1NRTF9PRkZfRVJST1IgKyBcIiBvciBcIiArIFZQTl9PTl9FUlJPUjtcbiAgICAgIHByaW50RXJyb3IoZXJyb3JfbWVzcywgJ3NlcnZlci9zcmMvY3JlYXRlQXBwLnRzJywgZXJyX21lc3MpO1xuICAgIH1cbiAgfVxufVxuXG5jb25zdCBjcmVhdGVBcHAgPSAoKSA9PiB7XG4gIGNvbnN0IGFwcCA9IGhlYWx0aEFwcCgpO1xuXG4gIGNvbnN0IGNsZWFyX2RiID0gXCIvXCIgKyBDTEVBUkRCX1NMVUc7XG4gIGFwcC5nZXQoY2xlYXJfZGIsIGFzeW5jIChfcmVxLCByZXMpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBkeW5hbW9fY2xlYXJfaGFuZGxlcigpO1xuICAgICAgY29uc3QgcmVzcG9uc2VfanNvbiA9IEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlKTtcbiAgICAgIGNoZWNrTm9TcWxXb3JrKHJlc3BvbnNlX2pzb24pO1xuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHJlc3BvbnNlX2pzb24pO1xuICAgIH0gY2F0Y2ggKGU6IHVua25vd24pIHtcbiAgICAgIHJldHVybiBjb3JzUmVzcG9uc2UoXCJ0aGVfZVwiKTtcbiAgICB9XG4gIH0pO1xuXG4gIGFwcC5nZXQoJy8nLCBhc3luYyAoX3JlcSwgcmVzKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZHluYW1vX2dldF9oYW5kbGVyKCk7XG4gICAgICBjb25zdCByZXNwb25zZV9qc29uID0gSlNPTi5wYXJzZShyZXNwb25zZS5ib2R5KTtcbiAgICAgIGNoZWNrTm9TcWxXb3JrKHJlc3BvbnNlX2pzb24pO1xuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHJlc3BvbnNlX2pzb24pO1xuICAgIH0gY2F0Y2ggKGU6IHVua25vd24pIHtcbiAgICAgIHJldHVybiBjb3JzUmVzcG9uc2UoXCJ0aGVfZVwiKTtcbiAgICB9XG4gIH0pO1xuXG4gIGFwcC5wb3N0KCcvJywgYXN5bmMgKHJlcSwgcmVzKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGpzb25fZGF0YSA9IHJlcS5ib2R5O1xuICAgICAgY29uc3Qgc3RyaW5nX2RhdGEgPSBKU09OLnN0cmluZ2lmeShqc29uX2RhdGEpO1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBkeW5hbW9fcG9zdF9oYW5kbGVyKHsgYm9keTogc3RyaW5nX2RhdGEgfSk7XG4gICAgICBjb25zdCByZXNwb25zZV9qc29uID0gSlNPTi5wYXJzZShyZXNwb25zZS5ib2R5KTtcbiAgICAgIGNoZWNrTm9TcWxXb3JrKHJlc3BvbnNlX2pzb24pO1xuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHJlc3BvbnNlX2pzb24pO1xuICAgIH0gY2F0Y2ggKGU6IHVua25vd24pIHtcbiAgICAgIHJldHVybiBjb3JzUmVzcG9uc2UoXCJ0aGVfZVwiKTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBhcHA7XG59O1xuZXhwb3J0IGRlZmF1bHQgY3JlYXRlQXBwO1xuXG4iXX0=