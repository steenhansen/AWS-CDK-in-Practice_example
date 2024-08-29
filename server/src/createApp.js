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
const lambda_1 = require("../../infrastructure/lib/constructs/Lambda/post/lambda/");
const lambda_2 = require("../../infrastructure/lib/constructs/Lambda/get/lambda/");
//import { dynamo_clear_handler } from '../../infrastructure/lib/constructs/Lambda/clear/lambda/';
const lambda_3 = require("../../infrastructure/lib/constructs/Lambda/healthcheck/lambda/");
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
            const response = await (0, lambda_3.healthcheck_handler)();
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
            const response = await (0, lambda_2.dynamo_get_handler)();
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
            const response = await (0, lambda_1.dynamo_post_handler)({ body: string_data });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlQXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY3JlYXRlQXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsc0RBQThCO0FBQzlCLGdEQUF3QjtBQUV4QixvREFBb0Q7QUFDcEQseUNBQXlDO0FBRXpDLCtDQUErQztBQUMvQyxxRkFBcUY7QUFFckYsb0ZBQThGO0FBQzlGLG1GQUE0RjtBQUM1RixrR0FBa0c7QUFFbEcsMkZBQXFHO0FBSXJHLFNBQVMsWUFBWSxDQUFDLFlBQW9CO0lBQ3hDLE1BQU0sU0FBUyxHQUFHO1FBQ2hCLFVBQVUsRUFBRSxHQUFHO1FBQ2YsT0FBTyxFQUFFO1lBQ1AsOEJBQThCLEVBQUUsY0FBYztZQUM5Qyw2QkFBNkIsRUFBRSxHQUFHO1lBQ2xDLDhCQUE4QixFQUFFLEtBQUs7U0FDdEM7UUFDRCxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsQ0FBQztLQUNoRCxDQUFDO0lBQ0YsT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQztBQUdELFNBQVMsY0FBYyxDQUFDLGFBQWtCO0lBQ3hDLElBQUksYUFBYSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsRUFBRTtRQUMzQyxNQUFNLFFBQVEsR0FBRyxhQUFhLENBQUMsT0FBTyxDQUFDO1FBQ3ZDLElBQUksUUFBUSxDQUFDLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFO1lBQzdDLE9BQU8sQ0FBQyxHQUFHLENBQUMsbURBQW1ELENBQUMsQ0FBQztZQUNqRSxPQUFPLENBQUMsR0FBRyxDQUFDLDhCQUE4QixDQUFDLENBQUM7U0FDN0M7S0FDRjtBQUNILENBQUM7QUFFRCxNQUFNLFNBQVMsR0FBRyxHQUFHLEVBQUU7SUFDckIsTUFBTSxHQUFHLEdBQUcsSUFBQSxpQkFBTyxHQUFFLENBQUM7SUFDdEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFBLGNBQUksR0FBRSxDQUFDLENBQUM7SUFDaEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxpQkFBTyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFFeEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsRUFBRTtRQUNyQyxJQUFJO1lBQ0YsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFBLDRCQUFtQixHQUFFLENBQUM7WUFDN0MsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMvQyxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1NBQzVDO1FBQUMsT0FBTyxDQUFVLEVBQUU7WUFDbkIsT0FBTyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDOUI7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUdILG1EQUFtRDtJQUNuRCxVQUFVO0lBQ1YscURBQXFEO0lBQ3JELHNEQUFzRDtJQUN0RCxxQ0FBcUM7SUFDckMsa0RBQWtEO0lBQ2xELDJCQUEyQjtJQUMzQixvQ0FBb0M7SUFDcEMsTUFBTTtJQUNOLE1BQU07SUFFTixHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFO1FBQy9CLElBQUk7WUFDRixNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUEsMkJBQWtCLEdBQUUsQ0FBQztZQUM1QyxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNoRCxjQUFjLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDOUIsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUM1QztRQUFDLE9BQU8sQ0FBVSxFQUFFO1lBQ25CLE9BQU8sWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQzlCO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFFSCxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO1FBQy9CLElBQUk7WUFDRixNQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO1lBQzNCLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDOUMsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFBLDRCQUFtQixFQUFDLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUM7WUFDbEUsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDaEQsY0FBYyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQzlCLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDNUM7UUFBQyxPQUFPLENBQVUsRUFBRTtZQUNuQixPQUFPLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUM5QjtJQUNILENBQUMsQ0FBQyxDQUFDO0lBS0gsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDLENBQUM7QUFFRixrQkFBZSxTQUFTLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJztcbmltcG9ydCBjb3JzIGZyb20gJ2NvcnMnO1xuXG4vLyAgaWRlYSBpcyB0byBoYXZlIGNyZWF0ZUFwcCBoYXZlIGF3cy1zZGsgaW5zdGFsbGVkXG4vLyBzbyB0aGF0IHRoZSBwb3N0IHdpbGwgYmUgb2sgb24gY29tcGlsZVxuXG4vL2ltcG9ydCB7IER5bmFtb0RCIH0gZnJvbSAnYXdzLXNkayc7ICAvLyBxYmVydFxuLy9pbXBvcnQgeyB2NCBhcyB1dWlkdjQgfSBmcm9tICd1dWlkJzsgLy8gcWJlcnQgdG8gdGhhdCBoZWFsdGgudGVzdC50cyBmaWxsIG5vdCBjcmFzaFxuXG5pbXBvcnQgeyBkeW5hbW9fcG9zdF9oYW5kbGVyIH0gZnJvbSAnLi4vLi4vaW5mcmFzdHJ1Y3R1cmUvbGliL2NvbnN0cnVjdHMvTGFtYmRhL3Bvc3QvbGFtYmRhLyc7XG5pbXBvcnQgeyBkeW5hbW9fZ2V0X2hhbmRsZXIgfSBmcm9tICcuLi8uLi9pbmZyYXN0cnVjdHVyZS9saWIvY29uc3RydWN0cy9MYW1iZGEvZ2V0L2xhbWJkYS8nO1xuLy9pbXBvcnQgeyBkeW5hbW9fY2xlYXJfaGFuZGxlciB9IGZyb20gJy4uLy4uL2luZnJhc3RydWN0dXJlL2xpYi9jb25zdHJ1Y3RzL0xhbWJkYS9jbGVhci9sYW1iZGEvJztcblxuaW1wb3J0IHsgaGVhbHRoY2hlY2tfaGFuZGxlciB9IGZyb20gJy4uLy4uL2luZnJhc3RydWN0dXJlL2xpYi9jb25zdHJ1Y3RzL0xhbWJkYS9oZWFsdGhjaGVjay9sYW1iZGEvJztcblxuXG5cbmZ1bmN0aW9uIGNvcnNSZXNwb25zZSh0aGVfcmVzcG9uc2U6IHN0cmluZykge1xuICBjb25zdCBjb3JzX3Jlc3AgPSB7XG4gICAgc3RhdHVzQ29kZTogMjAwLFxuICAgIGhlYWRlcnM6IHtcbiAgICAgIFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVyc1wiOiBcIkNvbnRlbnQtVHlwZVwiLFxuICAgICAgXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW5cIjogXCIqXCIsXG4gICAgICBcIkFjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHNcIjogXCJHRVRcIlxuICAgIH0sXG4gICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBtZXNzYWdlOiB0aGVfcmVzcG9uc2UgfSksXG4gIH07XG4gIHJldHVybiBjb3JzX3Jlc3A7XG59XG5cblxuZnVuY3Rpb24gY2hlY2tOb1NxbFdvcmsocmVzcG9uc2VfanNvbjogYW55KSB7XG4gIGlmIChyZXNwb25zZV9qc29uLmhhc093blByb3BlcnR5KCdtZXNzYWdlJykpIHtcbiAgICBjb25zdCBlcnJfbWVzcyA9IHJlc3BvbnNlX2pzb24ubWVzc2FnZTtcbiAgICBpZiAoZXJyX21lc3Muc3RhcnRzV2l0aChcIkluYWNjZXNzaWJsZSBob3N0OlwiKSkge1xuICAgICAgY29uc29sZS5sb2coXCIqKioqIElzICdEREIgbG9jYWwnIHR1cm5lZCBvbiBpbiBOb1NRTCBXb3JrYmVuY2g/XCIpO1xuICAgICAgY29uc29sZS5sb2coXCIqKioqIElzIHRoZXJlIGEgVlBOIHJ1bm5pbmc/XCIpO1xuICAgIH1cbiAgfVxufVxuXG5jb25zdCBjcmVhdGVBcHAgPSAoKSA9PiB7XG4gIGNvbnN0IGFwcCA9IGV4cHJlc3MoKTtcbiAgYXBwLnVzZShjb3JzKCkpO1xuICBhcHAudXNlKGV4cHJlc3MuanNvbigpKTtcblxuICBhcHAuZ2V0KCcvaGVhbHRoJywgYXN5bmMgKF9yZXEsIHJlcykgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGhlYWx0aGNoZWNrX2hhbmRsZXIoKTtcbiAgICAgIGNvbnN0IHJlc3BvbnNlX2pzb24gPSBKU09OLnN0cmluZ2lmeShyZXNwb25zZSk7XG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQocmVzcG9uc2VfanNvbik7XG4gICAgfSBjYXRjaCAoZTogdW5rbm93bikge1xuICAgICAgcmV0dXJuIGNvcnNSZXNwb25zZShcInRoZV9lXCIpO1xuICAgIH1cbiAgfSk7XG5cblxuICAvLyBhcHAuZ2V0KCcvY2xlYXInLCBhc3luYyAoX3JlcSwgcmVzKSA9PiB7ICAgcWJlcnRcbiAgLy8gICB0cnkge1xuICAvLyAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBkeW5hbW9fY2xlYXJfaGFuZGxlcigpO1xuICAvLyAgICAgY29uc3QgcmVzcG9uc2VfanNvbiA9IEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlKTtcbiAgLy8gICAgIGNoZWNrTm9TcWxXb3JrKHJlc3BvbnNlX2pzb24pO1xuICAvLyAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHJlc3BvbnNlX2pzb24pO1xuICAvLyAgIH0gY2F0Y2ggKGU6IHVua25vd24pIHtcbiAgLy8gICAgIHJldHVybiBjb3JzUmVzcG9uc2UoXCJ0aGVfZVwiKTtcbiAgLy8gICB9XG4gIC8vIH0pO1xuXG4gIGFwcC5nZXQoJy8nLCBhc3luYyAoX3JlcSwgcmVzKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZHluYW1vX2dldF9oYW5kbGVyKCk7XG4gICAgICBjb25zdCByZXNwb25zZV9qc29uID0gSlNPTi5wYXJzZShyZXNwb25zZS5ib2R5KTtcbiAgICAgIGNoZWNrTm9TcWxXb3JrKHJlc3BvbnNlX2pzb24pO1xuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHJlc3BvbnNlX2pzb24pO1xuICAgIH0gY2F0Y2ggKGU6IHVua25vd24pIHtcbiAgICAgIHJldHVybiBjb3JzUmVzcG9uc2UoXCJ0aGVfZVwiKTtcbiAgICB9XG4gIH0pO1xuXG4gIGFwcC5wb3N0KCcvJywgYXN5bmMgKHJlcSwgcmVzKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGpzb25fZGF0YSA9IHJlcS5ib2R5O1xuICAgICAgY29uc3Qgc3RyaW5nX2RhdGEgPSBKU09OLnN0cmluZ2lmeShqc29uX2RhdGEpO1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBkeW5hbW9fcG9zdF9oYW5kbGVyKHsgYm9keTogc3RyaW5nX2RhdGEgfSk7XG4gICAgICBjb25zdCByZXNwb25zZV9qc29uID0gSlNPTi5wYXJzZShyZXNwb25zZS5ib2R5KTtcbiAgICAgIGNoZWNrTm9TcWxXb3JrKHJlc3BvbnNlX2pzb24pO1xuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHJlc3BvbnNlX2pzb24pO1xuICAgIH0gY2F0Y2ggKGU6IHVua25vd24pIHtcbiAgICAgIHJldHVybiBjb3JzUmVzcG9uc2UoXCJ0aGVfZVwiKTtcbiAgICB9XG4gIH0pO1xuXG5cblxuXG4gIHJldHVybiBhcHA7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVBcHA7XG4iXX0=