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
const routine_1 = require("../../cloud/lib/constructs/Lambda/post/routine/");
const routine_2 = require("../../cloud/lib/constructs/Lambda/get/routine/");
const routine_3 = require("../../cloud/lib/constructs/Lambda/healthcheck/routine/");
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
            const response = await (0, routine_3.healthcheck_handler)();
            const response_json = JSON.stringify(response);
            return res.status(200).send(response_json);
        }
        catch (e) {
            return corsResponse("the_e");
        }
    });
    // app.get('/clear', async (_req, res) => {   qbert
    //   try {
    //     const response = await dynamo_clear_handler();
    //     const response_json = JSON.stringify(response);
    //     checkNoSqlWork(response_json);
    //     return res.status(200).send(response_json);
    //   } catch (e: unknown) {
    //     return corsResponse("the_e");
    //   }
    // });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlQXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY3JlYXRlQXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsc0RBQThCO0FBQzlCLGdEQUF3QjtBQUV4QixvREFBb0Q7QUFDcEQseUNBQXlDO0FBRXpDLCtDQUErQztBQUMvQyxxRkFBcUY7QUFFckYsNkVBQXNGO0FBQ3RGLDRFQUFvRjtBQUdwRixvRkFBNkY7QUFJN0YsU0FBUyxZQUFZLENBQUMsWUFBb0I7SUFDeEMsTUFBTSxTQUFTLEdBQUc7UUFDaEIsVUFBVSxFQUFFLEdBQUc7UUFDZixPQUFPLEVBQUU7WUFDUCw4QkFBOEIsRUFBRSxjQUFjO1lBQzlDLDZCQUE2QixFQUFFLEdBQUc7WUFDbEMsOEJBQThCLEVBQUUsS0FBSztTQUN0QztRQUNELElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxDQUFDO0tBQ2hELENBQUM7SUFDRixPQUFPLFNBQVMsQ0FBQztBQUNuQixDQUFDO0FBR0QsU0FBUyxjQUFjLENBQUMsYUFBa0I7SUFDeEMsSUFBSSxhQUFhLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUM7UUFDNUMsTUFBTSxRQUFRLEdBQUcsYUFBYSxDQUFDLE9BQU8sQ0FBQztRQUN2QyxJQUFJLFFBQVEsQ0FBQyxVQUFVLENBQUMsb0JBQW9CLENBQUMsRUFBRSxDQUFDO1lBQzlDLE9BQU8sQ0FBQyxHQUFHLENBQUMsbURBQW1ELENBQUMsQ0FBQztZQUNqRSxPQUFPLENBQUMsR0FBRyxDQUFDLDhCQUE4QixDQUFDLENBQUM7UUFDOUMsQ0FBQztJQUNILENBQUM7QUFDSCxDQUFDO0FBRUQsTUFBTSxTQUFTLEdBQUcsR0FBRyxFQUFFO0lBQ3JCLE1BQU0sR0FBRyxHQUFHLElBQUEsaUJBQU8sR0FBRSxDQUFDO0lBQ3RCLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBQSxjQUFJLEdBQUUsQ0FBQyxDQUFDO0lBQ2hCLEdBQUcsQ0FBQyxHQUFHLENBQUMsaUJBQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBRXhCLEdBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEVBQUU7UUFDckMsSUFBSSxDQUFDO1lBQ0gsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFBLDZCQUFtQixHQUFFLENBQUM7WUFDN0MsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMvQyxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzdDLENBQUM7UUFBQyxPQUFPLENBQVUsRUFBRSxDQUFDO1lBQ3BCLE9BQU8sWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQy9CLENBQUM7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUdILG1EQUFtRDtJQUNuRCxVQUFVO0lBQ1YscURBQXFEO0lBQ3JELHNEQUFzRDtJQUN0RCxxQ0FBcUM7SUFDckMsa0RBQWtEO0lBQ2xELDJCQUEyQjtJQUMzQixvQ0FBb0M7SUFDcEMsTUFBTTtJQUNOLE1BQU07SUFFTixHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFO1FBQy9CLElBQUksQ0FBQztZQUNILE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBQSw0QkFBa0IsR0FBRSxDQUFDO1lBQzVDLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2hELGNBQWMsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUM5QixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzdDLENBQUM7UUFBQyxPQUFPLENBQVUsRUFBRSxDQUFDO1lBQ3BCLE9BQU8sWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQy9CLENBQUM7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUVILEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUU7UUFDL0IsSUFBSSxDQUFDO1lBQ0gsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztZQUMzQixNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzlDLE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBQSw2QkFBbUIsRUFBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsQ0FBQyxDQUFDO1lBQ2xFLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2hELGNBQWMsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUM5QixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzdDLENBQUM7UUFBQyxPQUFPLENBQVUsRUFBRSxDQUFDO1lBQ3BCLE9BQU8sWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQy9CLENBQUM7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUtILE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQyxDQUFDO0FBRUYsa0JBQWUsU0FBUyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XHJcbmltcG9ydCBjb3JzIGZyb20gJ2NvcnMnO1xyXG5cclxuLy8gIGlkZWEgaXMgdG8gaGF2ZSBjcmVhdGVBcHAgaGF2ZSBhd3Mtc2RrIGluc3RhbGxlZFxyXG4vLyBzbyB0aGF0IHRoZSBwb3N0IHdpbGwgYmUgb2sgb24gY29tcGlsZVxyXG5cclxuLy9pbXBvcnQgeyBEeW5hbW9EQiB9IGZyb20gJ2F3cy1zZGsnOyAgLy8gcWJlcnRcclxuLy9pbXBvcnQgeyB2NCBhcyB1dWlkdjQgfSBmcm9tICd1dWlkJzsgLy8gcWJlcnQgdG8gdGhhdCBoZWFsdGgudGVzdC50cyBmaWxsIG5vdCBjcmFzaFxyXG5cclxuaW1wb3J0IHsgZHluYW1vX3Bvc3RfaGFuZGxlciB9IGZyb20gJy4uLy4uL2Nsb3VkL2xpYi9jb25zdHJ1Y3RzL0xhbWJkYS9wb3N0L3JvdXRpbmUvJztcclxuaW1wb3J0IHsgZHluYW1vX2dldF9oYW5kbGVyIH0gZnJvbSAnLi4vLi4vY2xvdWQvbGliL2NvbnN0cnVjdHMvTGFtYmRhL2dldC9yb3V0aW5lLyc7XHJcbmltcG9ydCB7IGR5bmFtb19jbGVhcl9oYW5kbGVyIH0gZnJvbSAnLi4vLi4vY2xvdWQvbGliL2NvbnN0cnVjdHMvTGFtYmRhL2NsZWFyL3JvdXRpbmUvJztcclxuXHJcbmltcG9ydCB7IGhlYWx0aGNoZWNrX2hhbmRsZXIgfSBmcm9tICcuLi8uLi9jbG91ZC9saWIvY29uc3RydWN0cy9MYW1iZGEvaGVhbHRoY2hlY2svcm91dGluZS8nO1xyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBjb3JzUmVzcG9uc2UodGhlX3Jlc3BvbnNlOiBzdHJpbmcpIHtcclxuICBjb25zdCBjb3JzX3Jlc3AgPSB7XHJcbiAgICBzdGF0dXNDb2RlOiAyMDAsXHJcbiAgICBoZWFkZXJzOiB7XHJcbiAgICAgIFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVyc1wiOiBcIkNvbnRlbnQtVHlwZVwiLFxyXG4gICAgICBcIkFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpblwiOiBcIipcIixcclxuICAgICAgXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1NZXRob2RzXCI6IFwiR0VUXCJcclxuICAgIH0sXHJcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IG1lc3NhZ2U6IHRoZV9yZXNwb25zZSB9KSxcclxuICB9O1xyXG4gIHJldHVybiBjb3JzX3Jlc3A7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBjaGVja05vU3FsV29yayhyZXNwb25zZV9qc29uOiBhbnkpIHtcclxuICBpZiAocmVzcG9uc2VfanNvbi5oYXNPd25Qcm9wZXJ0eSgnbWVzc2FnZScpKSB7XHJcbiAgICBjb25zdCBlcnJfbWVzcyA9IHJlc3BvbnNlX2pzb24ubWVzc2FnZTtcclxuICAgIGlmIChlcnJfbWVzcy5zdGFydHNXaXRoKFwiSW5hY2Nlc3NpYmxlIGhvc3Q6XCIpKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiKioqKiBJcyAnRERCIGxvY2FsJyB0dXJuZWQgb24gaW4gTm9TUUwgV29ya2JlbmNoP1wiKTtcclxuICAgICAgY29uc29sZS5sb2coXCIqKioqIElzIHRoZXJlIGEgVlBOIHJ1bm5pbmc/XCIpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuY29uc3QgY3JlYXRlQXBwID0gKCkgPT4ge1xyXG4gIGNvbnN0IGFwcCA9IGV4cHJlc3MoKTtcclxuICBhcHAudXNlKGNvcnMoKSk7XHJcbiAgYXBwLnVzZShleHByZXNzLmpzb24oKSk7XHJcblxyXG4gIGFwcC5nZXQoJy9oZWFsdGgnLCBhc3luYyAoX3JlcSwgcmVzKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGhlYWx0aGNoZWNrX2hhbmRsZXIoKTtcclxuICAgICAgY29uc3QgcmVzcG9uc2VfanNvbiA9IEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlKTtcclxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHJlc3BvbnNlX2pzb24pO1xyXG4gICAgfSBjYXRjaCAoZTogdW5rbm93bikge1xyXG4gICAgICByZXR1cm4gY29yc1Jlc3BvbnNlKFwidGhlX2VcIik7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG5cclxuICAvLyBhcHAuZ2V0KCcvY2xlYXInLCBhc3luYyAoX3JlcSwgcmVzKSA9PiB7ICAgcWJlcnRcclxuICAvLyAgIHRyeSB7XHJcbiAgLy8gICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZHluYW1vX2NsZWFyX2hhbmRsZXIoKTtcclxuICAvLyAgICAgY29uc3QgcmVzcG9uc2VfanNvbiA9IEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlKTtcclxuICAvLyAgICAgY2hlY2tOb1NxbFdvcmsocmVzcG9uc2VfanNvbik7XHJcbiAgLy8gICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZChyZXNwb25zZV9qc29uKTtcclxuICAvLyAgIH0gY2F0Y2ggKGU6IHVua25vd24pIHtcclxuICAvLyAgICAgcmV0dXJuIGNvcnNSZXNwb25zZShcInRoZV9lXCIpO1xyXG4gIC8vICAgfVxyXG4gIC8vIH0pO1xyXG5cclxuICBhcHAuZ2V0KCcvJywgYXN5bmMgKF9yZXEsIHJlcykgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBkeW5hbW9fZ2V0X2hhbmRsZXIoKTtcclxuICAgICAgY29uc3QgcmVzcG9uc2VfanNvbiA9IEpTT04ucGFyc2UocmVzcG9uc2UuYm9keSk7XHJcbiAgICAgIGNoZWNrTm9TcWxXb3JrKHJlc3BvbnNlX2pzb24pO1xyXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQocmVzcG9uc2VfanNvbik7XHJcbiAgICB9IGNhdGNoIChlOiB1bmtub3duKSB7XHJcbiAgICAgIHJldHVybiBjb3JzUmVzcG9uc2UoXCJ0aGVfZVwiKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgYXBwLnBvc3QoJy8nLCBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IGpzb25fZGF0YSA9IHJlcS5ib2R5O1xyXG4gICAgICBjb25zdCBzdHJpbmdfZGF0YSA9IEpTT04uc3RyaW5naWZ5KGpzb25fZGF0YSk7XHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZHluYW1vX3Bvc3RfaGFuZGxlcih7IGJvZHk6IHN0cmluZ19kYXRhIH0pO1xyXG4gICAgICBjb25zdCByZXNwb25zZV9qc29uID0gSlNPTi5wYXJzZShyZXNwb25zZS5ib2R5KTtcclxuICAgICAgY2hlY2tOb1NxbFdvcmsocmVzcG9uc2VfanNvbik7XHJcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZChyZXNwb25zZV9qc29uKTtcclxuICAgIH0gY2F0Y2ggKGU6IHVua25vd24pIHtcclxuICAgICAgcmV0dXJuIGNvcnNSZXNwb25zZShcInRoZV9lXCIpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuXHJcblxyXG5cclxuICByZXR1cm4gYXBwO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlQXBwO1xyXG4iXX0=