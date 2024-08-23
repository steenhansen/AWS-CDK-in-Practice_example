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
const routine_3 = require("../../cloud/lib/constructs/Lambda/clear/routine/");
const routine_4 = require("../../cloud/lib/constructs/Lambda/healthcheck/routine/");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlQXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY3JlYXRlQXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsc0RBQThCO0FBQzlCLGdEQUF3QjtBQUV4QixvREFBb0Q7QUFDcEQseUNBQXlDO0FBRXpDLCtDQUErQztBQUMvQyxxRkFBcUY7QUFFckYsNkVBQXNGO0FBQ3RGLDRFQUFvRjtBQUNwRiw4RUFBd0Y7QUFFeEYsb0ZBQTZGO0FBSTdGLFNBQVMsWUFBWSxDQUFDLFlBQW9CO0lBQ3hDLE1BQU0sU0FBUyxHQUFHO1FBQ2hCLFVBQVUsRUFBRSxHQUFHO1FBQ2YsT0FBTyxFQUFFO1lBQ1AsOEJBQThCLEVBQUUsY0FBYztZQUM5Qyw2QkFBNkIsRUFBRSxHQUFHO1lBQ2xDLDhCQUE4QixFQUFFLEtBQUs7U0FDdEM7UUFDRCxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsQ0FBQztLQUNoRCxDQUFDO0lBQ0YsT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQztBQUdELFNBQVMsY0FBYyxDQUFDLGFBQWtCO0lBQ3hDLElBQUksYUFBYSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDO1FBQzVDLE1BQU0sUUFBUSxHQUFHLGFBQWEsQ0FBQyxPQUFPLENBQUM7UUFDdkMsSUFBSSxRQUFRLENBQUMsVUFBVSxDQUFDLG9CQUFvQixDQUFDLEVBQUUsQ0FBQztZQUM5QyxPQUFPLENBQUMsR0FBRyxDQUFDLG1EQUFtRCxDQUFDLENBQUM7WUFDakUsT0FBTyxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO1FBQzlDLENBQUM7SUFDSCxDQUFDO0FBQ0gsQ0FBQztBQUVELE1BQU0sU0FBUyxHQUFHLEdBQUcsRUFBRTtJQUNyQixNQUFNLEdBQUcsR0FBRyxJQUFBLGlCQUFPLEdBQUUsQ0FBQztJQUN0QixHQUFHLENBQUMsR0FBRyxDQUFDLElBQUEsY0FBSSxHQUFF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LGtCQUFlLFNBQVMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xyXG5pbXBvcnQgY29ycyBmcm9tICdjb3JzJztcclxuXHJcbi8vICBpZGVhIGlzIHRvIGhhdmUgY3JlYXRlQXBwIGhhdmUgYXdzLXNkayBpbnN0YWxsZWRcclxuLy8gc28gdGhhdCB0aGUgcG9zdCB3aWxsIGJlIG9rIG9uIGNvbXBpbGVcclxuXHJcbi8vaW1wb3J0IHsgRHluYW1vREIgfSBmcm9tICdhd3Mtc2RrJzsgIC8vIHFiZXJ0XHJcbi8vaW1wb3J0IHsgdjQgYXMgdXVpZHY0IH0gZnJvbSAndXVpZCc7IC8vIHFiZXJ0IHRvIHRoYXQgaGVhbHRoLnRlc3QudHMgZmlsbCBub3QgY3Jhc2hcclxuXHJcbmltcG9ydCB7IGR5bmFtb19wb3N0X2hhbmRsZXIgfSBmcm9tICcuLi8uLi9jbG91ZC9saWIvY29uc3RydWN0cy9MYW1iZGEvcG9zdC9yb3V0aW5lLyc7XHJcbmltcG9ydCB7IGR5bmFtb19nZXRfaGFuZGxlciB9IGZyb20gJy4uLy4uL2Nsb3VkL2xpYi9jb25zdHJ1Y3RzL0xhbWJkYS9nZXQvcm91dGluZS8nO1xyXG5pbXBvcnQgeyBkeW5hbW9fY2xlYXJfaGFuZGxlciB9IGZyb20gJy4uLy4uL2Nsb3VkL2xpYi9jb25zdHJ1Y3RzL0xhbWJkYS9jbGVhci9yb3V0aW5lLyc7XHJcblxyXG5pbXBvcnQgeyBoZWFsdGhjaGVja19oYW5kbGVyIH0gZnJvbSAnLi4vLi4vY2xvdWQvbGliL2NvbnN0cnVjdHMvTGFtYmRhL2hlYWx0aGNoZWNrL3JvdXRpbmUvJztcclxuXHJcblxyXG5cclxuZnVuY3Rpb24gY29yc1Jlc3BvbnNlKHRoZV9yZXNwb25zZTogc3RyaW5nKSB7XHJcbiAgY29uc3QgY29yc19yZXNwID0ge1xyXG4gICAgc3RhdHVzQ29kZTogMjAwLFxyXG4gICAgaGVhZGVyczoge1xyXG4gICAgICBcIkFjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnNcIjogXCJDb250ZW50LVR5cGVcIixcclxuICAgICAgXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW5cIjogXCIqXCIsXHJcbiAgICAgIFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kc1wiOiBcIkdFVFwiXHJcbiAgICB9LFxyXG4gICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBtZXNzYWdlOiB0aGVfcmVzcG9uc2UgfSksXHJcbiAgfTtcclxuICByZXR1cm4gY29yc19yZXNwO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gY2hlY2tOb1NxbFdvcmsocmVzcG9uc2VfanNvbjogYW55KSB7XHJcbiAgaWYgKHJlc3BvbnNlX2pzb24uaGFzT3duUHJvcGVydHkoJ21lc3NhZ2UnKSkge1xyXG4gICAgY29uc3QgZXJyX21lc3MgPSByZXNwb25zZV9qc29uLm1lc3NhZ2U7XHJcbiAgICBpZiAoZXJyX21lc3Muc3RhcnRzV2l0aChcIkluYWNjZXNzaWJsZSBob3N0OlwiKSkge1xyXG4gICAgICBjb25zb2xlLmxvZyhcIioqKiogSXMgJ0REQiBsb2NhbCcgdHVybmVkIG9uIGluIE5vU1FMIFdvcmtiZW5jaD9cIik7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiKioqKiBJcyB0aGVyZSBhIFZQTiBydW5uaW5nP1wiKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmNvbnN0IGNyZWF0ZUFwcCA9ICgpID0+IHtcclxuICBjb25zdCBhcHAgPSBleHByZXNzKCk7XHJcbiAgYXBwLnVzZShjb3JzKCkpO1xyXG4gIGFwcC51c2UoZXhwcmVzcy5qc29uKCkpO1xyXG5cclxuICBhcHAuZ2V0KCcvaGVhbHRoJywgYXN5bmMgKF9yZXEsIHJlcykgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBoZWFsdGhjaGVja19oYW5kbGVyKCk7XHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlX2pzb24gPSBKU09OLnN0cmluZ2lmeShyZXNwb25zZSk7XHJcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZChyZXNwb25zZV9qc29uKTtcclxuICAgIH0gY2F0Y2ggKGU6IHVua25vd24pIHtcclxuICAgICAgcmV0dXJuIGNvcnNSZXNwb25zZShcInRoZV9lXCIpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuXHJcbiAgYXBwLmdldCgnL2NsZWFyJywgYXN5bmMgKF9yZXEsIHJlcykgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBkeW5hbW9fY2xlYXJfaGFuZGxlcigpO1xyXG4gICAgICBjb25zdCByZXNwb25zZV9qc29uID0gSlNPTi5zdHJpbmdpZnkocmVzcG9uc2UpO1xyXG4gICAgICBjaGVja05vU3FsV29yayhyZXNwb25zZV9qc29uKTtcclxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHJlc3BvbnNlX2pzb24pO1xyXG4gICAgfSBjYXRjaCAoZTogdW5rbm93bikge1xyXG4gICAgICByZXR1cm4gY29yc1Jlc3BvbnNlKFwidGhlX2VcIik7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIGFwcC5nZXQoJy8nLCBhc3luYyAoX3JlcSwgcmVzKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGR5bmFtb19nZXRfaGFuZGxlcigpO1xyXG4gICAgICBjb25zdCByZXNwb25zZV9qc29uID0gSlNPTi5wYXJzZShyZXNwb25zZS5ib2R5KTtcclxuICAgICAgY2hlY2tOb1NxbFdvcmsocmVzcG9uc2VfanNvbik7XHJcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZChyZXNwb25zZV9qc29uKTtcclxuICAgIH0gY2F0Y2ggKGU6IHVua25vd24pIHtcclxuICAgICAgcmV0dXJuIGNvcnNSZXNwb25zZShcInRoZV9lXCIpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICBhcHAucG9zdCgnLycsIGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QganNvbl9kYXRhID0gcmVxLmJvZHk7XHJcbiAgICAgIGNvbnN0IHN0cmluZ19kYXRhID0gSlNPTi5zdHJpbmdpZnkoanNvbl9kYXRhKTtcclxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBkeW5hbW9fcG9zdF9oYW5kbGVyKHsgYm9keTogc3RyaW5nX2RhdGEgfSk7XHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlX2pzb24gPSBKU09OLnBhcnNlKHJlc3BvbnNlLmJvZHkpO1xyXG4gICAgICBjaGVja05vU3FsV29yayhyZXNwb25zZV9qc29uKTtcclxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHJlc3BvbnNlX2pzb24pO1xyXG4gICAgfSBjYXRjaCAoZTogdW5rbm93bikge1xyXG4gICAgICByZXR1cm4gY29yc1Jlc3BvbnNlKFwidGhlX2VcIik7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG5cclxuXHJcblxyXG4gIHJldHVybiBhcHA7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVBcHA7XHJcbiJdfQ==