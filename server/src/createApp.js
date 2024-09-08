"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
//  idea is to have createApp have aws-sdk installed
// so that the post will be ok on compile
//import { DynamoDB } from 'aws-sdk';  // qbert
//import { v4 as uuidv4 } from 'uuid'; // qbert to that health.test.ts fill not crash
const routine_1 = require("../../cdk/lib/constructs/Lambda/post/routine/");
const routine_2 = require("../../cdk/lib/constructs/Lambda/get/routine/");
const routine_3 = require("../../cdk/lib/constructs/Lambda/clear/routine/");
const routine_4 = require("../../cdk/lib/constructs/Lambda/healthcheck/routine/");
const program_constants_json_1 = __importDefault(require("../../cdk/program.constants.json"));
const HEALTH_CHECK_SLUG = program_constants_json_1.default.HEALTH_CHECK_SLUG;
const CLEARDB_SLUG = program_constants_json_1.default.CLEARDB_SLUG;
const NO_SQL_OFF_ERROR = program_constants_json_1.default.NO_SQL_OFF_ERROR;
const VPN_ON_ERROR = program_constants_json_1.default.VPN_ON_ERROR;
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
function printError(error_mess) {
    console.log('\x1b[41m%s\x1b[0m', "**** " + error_mess);
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
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    const health_check = "/" + HEALTH_CHECK_SLUG;
    app.get(health_check, async (_req, res) => {
        try {
            const response = await (0, routine_4.healthcheck_handler)();
            const response_json = JSON.stringify(response);
            return res.status(200).send(response_json);
        }
        catch (e) {
            return corsResponse("the_e");
        }
    });
    const clear_db = "/" + CLEARDB_SLUG;
    app.get(clear_db, async (_req, res) => {
        try {
            const response = await (0, routine_3.dynamo_clear_handler)();
            const response_json = JSON.stringify(response);
            checkNoSqlWork(response_json);
            return res.status(200).send(response_json);
        }
        catch (e) {
            return corsResponse("the_e");
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
            return corsResponse("the_e");
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
            return corsResponse("the_e");
        }
    });
    return app;
};
exports.default = createApp;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlQXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY3JlYXRlQXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsc0RBQThCO0FBQzlCLGdEQUF3QjtBQUV4QixvREFBb0Q7QUFDcEQseUNBQXlDO0FBRXpDLCtDQUErQztBQUMvQyxxRkFBcUY7QUFFckYsMkVBQW9GO0FBQ3BGLDBFQUFrRjtBQUNsRiw0RUFBc0Y7QUFFdEYsa0ZBQTJGO0FBRTNGLDhGQUE2RDtBQUU3RCxNQUFNLGlCQUFpQixHQUFHLGdDQUFhLENBQUMsaUJBQWlCLENBQUM7QUFDMUQsTUFBTSxZQUFZLEdBQUcsZ0NBQWEsQ0FBQyxZQUFZLENBQUM7QUFDaEQsTUFBTSxnQkFBZ0IsR0FBRyxnQ0FBYSxDQUFDLGdCQUFnQixDQUFDO0FBQ3hELE1BQU0sWUFBWSxHQUFHLGdDQUFhLENBQUMsWUFBWSxDQUFDO0FBRWhELFNBQVMsWUFBWSxDQUFDLFlBQW9CO0lBQ3hDLE1BQU0sU0FBUyxHQUFHO1FBQ2hCLFVBQVUsRUFBRSxHQUFHO1FBQ2YsT0FBTyxFQUFFO1lBQ1AsOEJBQThCLEVBQUUsY0FBYztZQUM5Qyw2QkFBNkIsRUFBRSxHQUFHO1lBQ2xDLDhCQUE4QixFQUFFLEtBQUs7U0FDdEM7UUFDRCxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsQ0FBQztLQUNoRCxDQUFDO0lBQ0YsT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQztBQUVELFNBQVMsVUFBVSxDQUFDLFVBQWtCO0lBQ3BDLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQUUsT0FBTyxHQUFHLFVBQVUsQ0FBQyxDQUFDO0FBQ3pELENBQUM7QUFFRCxTQUFTLGNBQWMsQ0FBQyxhQUFrQjtJQUN4QyxJQUFJLGFBQWEsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQztRQUM1QyxNQUFNLFFBQVEsR0FBRyxhQUFhLENBQUMsT0FB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QUFHLE1BQU0sSUFBQSw2QkFBbUIsRUFBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsQ0FBQyxDQUFDO1lBQ2xFLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2hELGNBQWMsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUM5QixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzdDLENBQUM7UUFBQyxPQUFPLENBQVUsRUFBRSxDQUFDO1lBQ3BCLE9BQU8sWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQy9CLENBQUM7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUtILE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQyxDQUFDO0FBRUYsa0JBQWUsU0FBUyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgY29ycyBmcm9tICdjb3JzJztcblxuLy8gIGlkZWEgaXMgdG8gaGF2ZSBjcmVhdGVBcHAgaGF2ZSBhd3Mtc2RrIGluc3RhbGxlZFxuLy8gc28gdGhhdCB0aGUgcG9zdCB3aWxsIGJlIG9rIG9uIGNvbXBpbGVcblxuLy9pbXBvcnQgeyBEeW5hbW9EQiB9IGZyb20gJ2F3cy1zZGsnOyAgLy8gcWJlcnRcbi8vaW1wb3J0IHsgdjQgYXMgdXVpZHY0IH0gZnJvbSAndXVpZCc7IC8vIHFiZXJ0IHRvIHRoYXQgaGVhbHRoLnRlc3QudHMgZmlsbCBub3QgY3Jhc2hcblxuaW1wb3J0IHsgZHluYW1vX3Bvc3RfaGFuZGxlciB9IGZyb20gJy4uLy4uL2Nkay9saWIvY29uc3RydWN0cy9MYW1iZGEvcG9zdC9yb3V0aW5lLyc7XG5pbXBvcnQgeyBkeW5hbW9fZ2V0X2hhbmRsZXIgfSBmcm9tICcuLi8uLi9jZGsvbGliL2NvbnN0cnVjdHMvTGFtYmRhL2dldC9yb3V0aW5lLyc7XG5pbXBvcnQgeyBkeW5hbW9fY2xlYXJfaGFuZGxlciB9IGZyb20gJy4uLy4uL2Nkay9saWIvY29uc3RydWN0cy9MYW1iZGEvY2xlYXIvcm91dGluZS8nO1xuXG5pbXBvcnQgeyBoZWFsdGhjaGVja19oYW5kbGVyIH0gZnJvbSAnLi4vLi4vY2RrL2xpYi9jb25zdHJ1Y3RzL0xhbWJkYS9oZWFsdGhjaGVjay9yb3V0aW5lLyc7XG5cbmltcG9ydCB0aGVfY29uc3RhbnRzIGZyb20gJy4uLy4uL2Nkay9wcm9ncmFtLmNvbnN0YW50cy5qc29uJztcblxuY29uc3QgSEVBTFRIX0NIRUNLX1NMVUcgPSB0aGVfY29uc3RhbnRzLkhFQUxUSF9DSEVDS19TTFVHO1xuY29uc3QgQ0xFQVJEQl9TTFVHID0gdGhlX2NvbnN0YW50cy5DTEVBUkRCX1NMVUc7XG5jb25zdCBOT19TUUxfT0ZGX0VSUk9SID0gdGhlX2NvbnN0YW50cy5OT19TUUxfT0ZGX0VSUk9SO1xuY29uc3QgVlBOX09OX0VSUk9SID0gdGhlX2NvbnN0YW50cy5WUE5fT05fRVJST1I7XG5cbmZ1bmN0aW9uIGNvcnNSZXNwb25zZSh0aGVfcmVzcG9uc2U6IHN0cmluZykge1xuICBjb25zdCBjb3JzX3Jlc3AgPSB7XG4gICAgc3RhdHVzQ29kZTogMjAwLFxuICAgIGhlYWRlcnM6IHtcbiAgICAgIFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVyc1wiOiBcIkNvbnRlbnQtVHlwZVwiLFxuICAgICAgXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW5cIjogXCIqXCIsXG4gICAgICBcIkFjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHNcIjogXCJHRVRcIlxuICAgIH0sXG4gICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBtZXNzYWdlOiB0aGVfcmVzcG9uc2UgfSksXG4gIH07XG4gIHJldHVybiBjb3JzX3Jlc3A7XG59XG5cbmZ1bmN0aW9uIHByaW50RXJyb3IoZXJyb3JfbWVzczogc3RyaW5nKSB7XG4gIGNvbnNvbGUubG9nKCdcXHgxYls0MW0lc1xceDFiWzBtJywgXCIqKioqIFwiICsgZXJyb3JfbWVzcyk7XG59XG5cbmZ1bmN0aW9uIGNoZWNrTm9TcWxXb3JrKHJlc3BvbnNlX2pzb246IGFueSkge1xuICBpZiAocmVzcG9uc2VfanNvbi5oYXNPd25Qcm9wZXJ0eSgnbWVzc2FnZScpKSB7XG4gICAgY29uc3QgZXJyX21lc3MgPSByZXNwb25zZV9qc29uLm1lc3NhZ2U7XG4gICAgaWYgKGVycl9tZXNzLnN0YXJ0c1dpdGgoXCJJbmFjY2Vzc2libGUgaG9zdDpcIikpIHtcbiAgICAgIGNvbnN0IHByb2JfbWVzcyA9IE5PX1NRTF9PRkZfRVJST1IgKyBcIiBvciBcIiArIFZQTl9PTl9FUlJPUjtcbiAgICAgIHByaW50RXJyb3IocHJvYl9tZXNzKTtcbiAgICB9XG4gIH1cbn1cblxuY29uc3QgY3JlYXRlQXBwID0gKCkgPT4ge1xuICBjb25zdCBhcHAgPSBleHByZXNzKCk7XG4gIGFwcC51c2UoY29ycygpKTtcbiAgYXBwLnVzZShleHByZXNzLmpzb24oKSk7XG5cbiAgY29uc3QgaGVhbHRoX2NoZWNrID0gXCIvXCIgKyBIRUFMVEhfQ0hFQ0tfU0xVRztcbiAgYXBwLmdldChoZWFsdGhfY2hlY2ssIGFzeW5jIChfcmVxLCByZXMpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBoZWFsdGhjaGVja19oYW5kbGVyKCk7XG4gICAgICBjb25zdCByZXNwb25zZV9qc29uID0gSlNPTi5zdHJpbmdpZnkocmVzcG9uc2UpO1xuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHJlc3BvbnNlX2pzb24pO1xuICAgIH0gY2F0Y2ggKGU6IHVua25vd24pIHtcbiAgICAgIHJldHVybiBjb3JzUmVzcG9uc2UoXCJ0aGVfZVwiKTtcbiAgICB9XG4gIH0pO1xuXG4gIGNvbnN0IGNsZWFyX2RiID0gXCIvXCIgKyBDTEVBUkRCX1NMVUc7XG4gIGFwcC5nZXQoY2xlYXJfZGIsIGFzeW5jIChfcmVxLCByZXMpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBkeW5hbW9fY2xlYXJfaGFuZGxlcigpO1xuICAgICAgY29uc3QgcmVzcG9uc2VfanNvbiA9IEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlKTtcbiAgICAgIGNoZWNrTm9TcWxXb3JrKHJlc3BvbnNlX2pzb24pO1xuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHJlc3BvbnNlX2pzb24pO1xuICAgIH0gY2F0Y2ggKGU6IHVua25vd24pIHtcbiAgICAgIHJldHVybiBjb3JzUmVzcG9uc2UoXCJ0aGVfZVwiKTtcbiAgICB9XG4gIH0pO1xuXG4gIGFwcC5nZXQoJy8nLCBhc3luYyAoX3JlcSwgcmVzKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZHluYW1vX2dldF9oYW5kbGVyKCk7XG4gICAgICBjb25zdCByZXNwb25zZV9qc29uID0gSlNPTi5wYXJzZShyZXNwb25zZS5ib2R5KTtcbiAgICAgIGNoZWNrTm9TcWxXb3JrKHJlc3BvbnNlX2pzb24pO1xuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHJlc3BvbnNlX2pzb24pO1xuICAgIH0gY2F0Y2ggKGU6IHVua25vd24pIHtcbiAgICAgIHJldHVybiBjb3JzUmVzcG9uc2UoXCJ0aGVfZVwiKTtcbiAgICB9XG4gIH0pO1xuXG4gIGFwcC5wb3N0KCcvJywgYXN5bmMgKHJlcSwgcmVzKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGpzb25fZGF0YSA9IHJlcS5ib2R5O1xuICAgICAgY29uc3Qgc3RyaW5nX2RhdGEgPSBKU09OLnN0cmluZ2lmeShqc29uX2RhdGEpO1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBkeW5hbW9fcG9zdF9oYW5kbGVyKHsgYm9keTogc3RyaW5nX2RhdGEgfSk7XG4gICAgICBjb25zdCByZXNwb25zZV9qc29uID0gSlNPTi5wYXJzZShyZXNwb25zZS5ib2R5KTtcbiAgICAgIGNoZWNrTm9TcWxXb3JrKHJlc3BvbnNlX2pzb24pO1xuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHJlc3BvbnNlX2pzb24pO1xuICAgIH0gY2F0Y2ggKGU6IHVua25vd24pIHtcbiAgICAgIHJldHVybiBjb3JzUmVzcG9uc2UoXCJ0aGVfZVwiKTtcbiAgICB9XG4gIH0pO1xuXG5cblxuXG4gIHJldHVybiBhcHA7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVBcHA7XG4iXX0=