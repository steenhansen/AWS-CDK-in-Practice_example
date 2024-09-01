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
const routine_1 = require("../../infrastructure/lib/constructs/Lambda/post/routine/");
const routine_2 = require("../../infrastructure/lib/constructs/Lambda/get/routine/");
const routine_3 = require("../../infrastructure/lib/constructs/Lambda/clear/routine/");
const routine_4 = require("../../infrastructure/lib/constructs/Lambda/healthcheck/routine/");
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
function checkNoSqlWork(response_json) {
    if (response_json.hasOwnProperty('message')) {
        const err_mess = response_json.message;
        if (err_mess.startsWith("Inaccessible host:")) {
            console.log("**** Is 'DDB local' turned on in NoSQL Workbench?");
            console.log("**** Is there a VPN running?");
        }
    }
}
const createApp = () => {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.get('/health', async (_req, res) => {
        try {
            const response = await (0, routine_4.healthcheck_handler)();
            const response_json = JSON.stringify(response);
            return res.status(200).send(response_json);
        }
        catch (e) {
            return corsResponse("the_e");
        }
    });
    app.get('/clear', async (_req, res) => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlQXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY3JlYXRlQXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsc0RBQThCO0FBQzlCLGdEQUF3QjtBQUV4QixvREFBb0Q7QUFDcEQseUNBQXlDO0FBRXpDLCtDQUErQztBQUMvQyxxRkFBcUY7QUFFckYsc0ZBQStGO0FBQy9GLHFGQUE2RjtBQUM3Rix1RkFBaUc7QUFFakcsNkZBQXNHO0FBSXRHLFNBQVMsWUFBWSxDQUFDLFlBQW9CO0lBQ3hDLE1BQU0sU0FBUyxHQUFHO1FBQ2hCLFVBQVUsRUFBRSxHQUFHO1FBQ2YsT0FBTyxFQUFFO1lBQ1AsOEJBQThCLEVBQUUsY0FBYztZQUM5Qyw2QkFBNkIsRUFBRSxHQUFHO1lBQ2xDLDhCQUE4QixFQUFFLEtBQUs7U0FDdEM7UUFDRCxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsQ0FBQztLQUNoRCxDQUFDO0lBQ0YsT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQztBQUdELFNBQVMsY0FBYyxDQUFDLGFBQWtCO0lBQ3hDLElBQUksYUFBYSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsRUFBRTtRQUMzQyxNQUFNLFFBQVEsR0FBRyxhQUFhLENBQUMsT0FBTyxDQUFDO1FBQ3ZDLElBQUksUUFBUSxDQUFDLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFO1lBQzdDLE9BQU8sQ0FBQyxHQUFHLENBQUMsbURBQW1ELENBQUMsQ0FBQztZQUNqRSxPQUFPLENBQUMsR0FBRyxDQUFDLDhCQUE4QixDQUFDLENBQUM7U0FDN0M7S0FDRjtBQUNILENBQUM7QUFFRCxNQUFNLFNBQVMsR0FBRyxHQUFHLEVBQUU7SUFDckIsTUFBTSxHQUFHLEdBQUcsSUFBQSxpQkFBTyxHQUFFLENBQUM7SUFDdEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFBLGNBQUksR0FBRSxDQUFDLENBQUM7SUFDaEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxpQkFBTyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFFeEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsRUFBRTtRQUNyQyxJQUFJO1lBQ0YsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFBLDZCQUFtQixHQUFFLENBQUM7WUFDN0MsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMvQyxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1NBQzVDO1FBQUMsT0FBTyxDQUFVLEVBQUU7WUFDbkIsT0FBTyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDOUI7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUdILEdBQUcsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEVBQUU7UUFDcEMsSUFBSTtZQUNGLE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBQSw4QkFBb0IsR0FBRSxDQUFDO1lBQzlDLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDL0MsY0FBYyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQzlCLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDNUM7UUFBQyxPQUFPLENBQVUsRUFBRTtZQUNuQixPQUFPLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUM5QjtJQUNILENBQUMsQ0FBQyxDQUFDO0lBRUgsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsRUFBRTtRQUMvQixJQUFJO1lBQ0YsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFBLDRCQUFrQixHQUFFLENBQUM7WUFDNUMsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDaEQsY0FBYyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQzlCLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDNUM7UUFBQyxPQUFPLENBQVUsRUFBRTtZQUNuQixPQUFPLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUM5QjtJQUNILENBQUMsQ0FBQyxDQUFDO0lBRUgsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtRQUMvQixJQUFJO1lBQ0YsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztZQUMzQixNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzlDLE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBQSw2QkFBbUIsRUFBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsQ0FBQyxDQUFDO1lBQ2xFLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2hELGNBQWMsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUM5QixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1NBQzVDO1FBQUMsT0FBTyxDQUFVLEVBQUU7WUFDbkIsT0FBTyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDOUI7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUtILE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQyxDQUFDO0FBRUYsa0JBQWUsU0FBUyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgY29ycyBmcm9tICdjb3JzJztcblxuLy8gIGlkZWEgaXMgdG8gaGF2ZSBjcmVhdGVBcHAgaGF2ZSBhd3Mtc2RrIGluc3RhbGxlZFxuLy8gc28gdGhhdCB0aGUgcG9zdCB3aWxsIGJlIG9rIG9uIGNvbXBpbGVcblxuLy9pbXBvcnQgeyBEeW5hbW9EQiB9IGZyb20gJ2F3cy1zZGsnOyAgLy8gcWJlcnRcbi8vaW1wb3J0IHsgdjQgYXMgdXVpZHY0IH0gZnJvbSAndXVpZCc7IC8vIHFiZXJ0IHRvIHRoYXQgaGVhbHRoLnRlc3QudHMgZmlsbCBub3QgY3Jhc2hcblxuaW1wb3J0IHsgZHluYW1vX3Bvc3RfaGFuZGxlciB9IGZyb20gJy4uLy4uL2luZnJhc3RydWN0dXJlL2xpYi9jb25zdHJ1Y3RzL0xhbWJkYS9wb3N0L3JvdXRpbmUvJztcbmltcG9ydCB7IGR5bmFtb19nZXRfaGFuZGxlciB9IGZyb20gJy4uLy4uL2luZnJhc3RydWN0dXJlL2xpYi9jb25zdHJ1Y3RzL0xhbWJkYS9nZXQvcm91dGluZS8nO1xuaW1wb3J0IHsgZHluYW1vX2NsZWFyX2hhbmRsZXIgfSBmcm9tICcuLi8uLi9pbmZyYXN0cnVjdHVyZS9saWIvY29uc3RydWN0cy9MYW1iZGEvY2xlYXIvcm91dGluZS8nO1xuXG5pbXBvcnQgeyBoZWFsdGhjaGVja19oYW5kbGVyIH0gZnJvbSAnLi4vLi4vaW5mcmFzdHJ1Y3R1cmUvbGliL2NvbnN0cnVjdHMvTGFtYmRhL2hlYWx0aGNoZWNrL3JvdXRpbmUvJztcblxuXG5cbmZ1bmN0aW9uIGNvcnNSZXNwb25zZSh0aGVfcmVzcG9uc2U6IHN0cmluZykge1xuICBjb25zdCBjb3JzX3Jlc3AgPSB7XG4gICAgc3RhdHVzQ29kZTogMjAwLFxuICAgIGhlYWRlcnM6IHtcbiAgICAgIFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVyc1wiOiBcIkNvbnRlbnQtVHlwZVwiLFxuICAgICAgXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW5cIjogXCIqXCIsXG4gICAgICBcIkFjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHNcIjogXCJHRVRcIlxuICAgIH0sXG4gICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBtZXNzYWdlOiB0aGVfcmVzcG9uc2UgfSksXG4gIH07XG4gIHJldHVybiBjb3JzX3Jlc3A7XG59XG5cblxuZnVuY3Rpb24gY2hlY2tOb1NxbFdvcmsocmVzcG9uc2VfanNvbjogYW55KSB7XG4gIGlmIChyZXNwb25zZV9qc29uLmhhc093blByb3BlcnR5KCdtZXNzYWdlJykpIHtcbiAgICBjb25zdCBlcnJfbWVzcyA9IHJlc3BvbnNlX2pzb24ubWVzc2FnZTtcbiAgICBpZiAoZXJyX21lc3Muc3RhcnRzV2l0aChcIkluYWNjZXNzaWJsZSBob3N0OlwiKSkge1xuICAgICAgY29uc29sZS5sb2coXCIqKioqIElzICdEREIgbG9jYWwnIHR1cm5lZCBvbiBpbiBOb1NRTCBXb3JrYmVuY2g/XCIpO1xuICAgICAgY29uc29sZS5sb2coXCIqKioqIElzIHRoZXJlIGEgVlBOIHJ1bm5pbmc/XCIpO1xuICAgIH1cbiAgfVxufVxuXG5jb25zdCBjcmVhdGVBcHAgPSAoKSA9PiB7XG4gIGNvbnN0IGFwcCA9IGV4cHJlc3MoKTtcbiAgYXBwLnVzZShjb3JzKCkpO1xuICBhcHAudXNlKGV4cHJlc3MuanNvbigpKTtcblxuICBhcHAuZ2V0KCcvaGVhbHRoJywgYXN5bmMgKF9yZXEsIHJlcykgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGhlYWx0aGNoZWNrX2hhbmRsZXIoKTtcbiAgICAgIGNvbnN0IHJlc3BvbnNlX2pzb24gPSBKU09OLnN0cmluZ2lmeShyZXNwb25zZSk7XG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQocmVzcG9uc2VfanNvbik7XG4gICAgfSBjYXRjaCAoZTogdW5rbm93bikge1xuICAgICAgcmV0dXJuIGNvcnNSZXNwb25zZShcInRoZV9lXCIpO1xuICAgIH1cbiAgfSk7XG5cblxuICBhcHAuZ2V0KCcvY2xlYXInLCBhc3luYyAoX3JlcSwgcmVzKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZHluYW1vX2NsZWFyX2hhbmRsZXIoKTtcbiAgICAgIGNvbnN0IHJlc3BvbnNlX2pzb24gPSBKU09OLnN0cmluZ2lmeShyZXNwb25zZSk7XG4gICAgICBjaGVja05vU3FsV29yayhyZXNwb25zZV9qc29uKTtcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZChyZXNwb25zZV9qc29uKTtcbiAgICB9IGNhdGNoIChlOiB1bmtub3duKSB7XG4gICAgICByZXR1cm4gY29yc1Jlc3BvbnNlKFwidGhlX2VcIik7XG4gICAgfVxuICB9KTtcblxuICBhcHAuZ2V0KCcvJywgYXN5bmMgKF9yZXEsIHJlcykgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGR5bmFtb19nZXRfaGFuZGxlcigpO1xuICAgICAgY29uc3QgcmVzcG9uc2VfanNvbiA9IEpTT04ucGFyc2UocmVzcG9uc2UuYm9keSk7XG4gICAgICBjaGVja05vU3FsV29yayhyZXNwb25zZV9qc29uKTtcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZChyZXNwb25zZV9qc29uKTtcbiAgICB9IGNhdGNoIChlOiB1bmtub3duKSB7XG4gICAgICByZXR1cm4gY29yc1Jlc3BvbnNlKFwidGhlX2VcIik7XG4gICAgfVxuICB9KTtcblxuICBhcHAucG9zdCgnLycsIGFzeW5jIChyZXEsIHJlcykgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBqc29uX2RhdGEgPSByZXEuYm9keTtcbiAgICAgIGNvbnN0IHN0cmluZ19kYXRhID0gSlNPTi5zdHJpbmdpZnkoanNvbl9kYXRhKTtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZHluYW1vX3Bvc3RfaGFuZGxlcih7IGJvZHk6IHN0cmluZ19kYXRhIH0pO1xuICAgICAgY29uc3QgcmVzcG9uc2VfanNvbiA9IEpTT04ucGFyc2UocmVzcG9uc2UuYm9keSk7XG4gICAgICBjaGVja05vU3FsV29yayhyZXNwb25zZV9qc29uKTtcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZChyZXNwb25zZV9qc29uKTtcbiAgICB9IGNhdGNoIChlOiB1bmtub3duKSB7XG4gICAgICByZXR1cm4gY29yc1Jlc3BvbnNlKFwidGhlX2VcIik7XG4gICAgfVxuICB9KTtcblxuXG5cblxuICByZXR1cm4gYXBwO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlQXBwO1xuIl19