"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// import create_app from './createApp';
const server_config_json_1 = __importDefault(require("./server.config.json"));
let port;
if (((_a = process.env["LOCAL_MODE"]) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === 'yes') {
    port = server_config_json_1.default.PORT_SERVER || '80';
}
else {
    port = process.env.PORT || '80';
}
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
const app = createApp();
const server = app.listen(port, () => {
    console.info(`Local server is listening on port ${port}`);
});
server.keepAliveTimeout = 10;
server.headersTimeout = 10;
createApp();
exports.default = createApp;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFFQSxzREFBOEI7QUFDOUIsZ0RBQXdCO0FBR3hCLHdDQUF3QztBQUN4Qyw4RUFBMEM7QUFFMUMsSUFBSSxJQUFZLENBQUM7QUFDakIsSUFBSSxDQUFBLE1BQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsMENBQUUsV0FBVyxFQUFFLE1BQUssS0FBSyxFQUFFLENBQUM7SUFDdkQsSUFBSSxHQUFHLDRCQUFNLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQztBQUNwQyxDQUFDO0tBQU0sQ0FBQztJQUNOLElBQUksR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUM7QUFFbEMsQ0FBQztBQW9CRCw2RUFBc0Y7QUFDdEYsNEVBQW9GO0FBQ3BGLDhFQUF3RjtBQUV4RixvRkFBNkY7QUFJN0YsU0FBUyxZQUFZLENBQUMsWUFBb0I7SUFDeEMsTUFBTSxTQUFTLEdBQUc7UUFDaEIsVUFBVSxFQUFFLEdBQUc7UUFDZixPQUFPLEVBQUU7WUFDUCw4QkFBOEIsRUFBRSxjQUFjO1lBQzlDLDZCQUE2QixFQUFFLEdBQUc7WUFDbEMsOEJBQThCLEVBQUUsS0FBSztTQUN0QztRQUNELElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxDQUFDO0tBQ2hELENBQUM7SUFDRixPQUFPLFNBQVMsQ0FBQztBQUNuQixDQUFDO0FBR0QsU0FBUyxjQUFjLENBQUMsYUFBa0I7SUFDeEMsSUFBSSxhQUFhLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUM7UUFDNUMsTUFBTSxRQUFRLEdBQUcsYUFBYSxDQUFDLE9BQU8sQ0FBQztRQUN2QyxJQUFJLFFBQVEsQ0FBQyxVQUFVLENBQUMsb0JBQW9CLENBQUMsRUFBRSxDQUFDO1lBQzlDLE9BQU8sQ0FBQyxHQUFH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QixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzdDLENBQUM7UUFBQyxPQUFPLENBQVUsRUFBRSxDQUFDO1lBQ3BCLE9BQU8sWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQy9CLENBQUM7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUtILE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQyxDQUFDO0FBRUYsTUFBTSxHQUFHLEdBQUcsU0FBUyxFQUFFLENBQUM7QUFDeEIsTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFO0lBQ25DLE9BQU8sQ0FBQyxJQUFJLENBQUMscUNBQXFDLElBQUksRUFBRSxDQUFDLENBQUM7QUFDNUQsQ0FBQyxDQUFDLENBQUM7QUFDSCxNQUFNLENBQUMsZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO0FBQzdCLE1BQU0sQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFDO0FBQzNCLFNBQVMsRUFBRSxDQUFDO0FBRVosa0JBQWUsU0FBUyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiXHJcblxyXG5pbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJztcclxuaW1wb3J0IGNvcnMgZnJvbSAnY29ycyc7XHJcblxyXG5cclxuLy8gaW1wb3J0IGNyZWF0ZV9hcHAgZnJvbSAnLi9jcmVhdGVBcHAnO1xyXG5pbXBvcnQgY29uZmlnIGZyb20gJy4vc2VydmVyLmNvbmZpZy5qc29uJztcclxuXHJcbmxldCBwb3J0OiBzdHJpbmc7XHJcbmlmIChwcm9jZXNzLmVudltcIkxPQ0FMX01PREVcIl0/LnRvTG93ZXJDYXNlKCkgPT09ICd5ZXMnKSB7XHJcbiAgcG9ydCA9IGNvbmZpZy5QT1JUX1NFUlZFUiB8fCAnODAnO1xyXG59IGVsc2Uge1xyXG4gIHBvcnQgPSBwcm9jZXNzLmVudi5QT1JUIHx8ICc4MCc7XHJcblxyXG59XHJcblxyXG5cclxuLy8gY29uc3QgYXBwID0gY3JlYXRlX2FwcCgpO1xyXG4vLyBjb25zdCBzZXJ2ZXIgPSBhcHAubGlzdGVuKHBvcnQsICgpID0+IHtcclxuLy8gICBjb25zb2xlLmluZm8oYExvY2FsIHNlcnZlciBpcyBsaXN0ZW5pbmcgb24gcG9ydCAke3BvcnR9YCk7XHJcbi8vIH0pO1xyXG4vLyBzZXJ2ZXIua2VlcEFsaXZlVGltZW91dCA9IDEwO1xyXG4vLyBzZXJ2ZXIuaGVhZGVyc1RpbWVvdXQgPSAxMDtcclxuLy8gY3JlYXRlX2FwcCgpO1xyXG5cclxuXHJcblxyXG5cclxuLy8gIGlkZWEgaXMgdG8gaGF2ZSBjcmVhdGVBcHAgaGF2ZSBhd3Mtc2RrIGluc3RhbGxlZFxyXG4vLyBzbyB0aGF0IHRoZSBwb3N0IHdpbGwgYmUgb2sgb24gY29tcGlsZVxyXG5cclxuaW1wb3J0IHsgRHluYW1vREIgfSBmcm9tICdhd3Mtc2RrJzsgIC8vIHFiZXJ0XHJcbmltcG9ydCB7IHY0IGFzIHV1aWR2NCB9IGZyb20gJ3V1aWQnOyAvLyBxYmVydCB0byB0aGF0IGhlYWx0aC50ZXN0LnRzIGZpbGwgbm90IGNyYXNoXHJcblxyXG5pbXBvcnQgeyBkeW5hbW9fcG9zdF9oYW5kbGVyIH0gZnJvbSAnLi4vLi4vY2xvdWQvbGliL2NvbnN0cnVjdHMvTGFtYmRhL3Bvc3Qvcm91dGluZS8nO1xyXG5pbXBvcnQgeyBkeW5hbW9fZ2V0X2hhbmRsZXIgfSBmcm9tICcuLi8uLi9jbG91ZC9saWIvY29uc3RydWN0cy9MYW1iZGEvZ2V0L3JvdXRpbmUvJztcclxuaW1wb3J0IHsgZHluYW1vX2NsZWFyX2hhbmRsZXIgfSBmcm9tICcuLi8uLi9jbG91ZC9saWIvY29uc3RydWN0cy9MYW1iZGEvY2xlYXIvcm91dGluZS8nO1xyXG5cclxuaW1wb3J0IHsgaGVhbHRoY2hlY2tfaGFuZGxlciB9IGZyb20gJy4uLy4uL2Nsb3VkL2xpYi9jb25zdHJ1Y3RzL0xhbWJkYS9oZWFsdGhjaGVjay9yb3V0aW5lLyc7XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGNvcnNSZXNwb25zZSh0aGVfcmVzcG9uc2U6IHN0cmluZykge1xyXG4gIGNvbnN0IGNvcnNfcmVzcCA9IHtcclxuICAgIHN0YXR1c0NvZGU6IDIwMCxcclxuICAgIGhlYWRlcnM6IHtcclxuICAgICAgXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzXCI6IFwiQ29udGVudC1UeXBlXCIsXHJcbiAgICAgIFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luXCI6IFwiKlwiLFxyXG4gICAgICBcIkFjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHNcIjogXCJHRVRcIlxyXG4gICAgfSxcclxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgbWVzc2FnZTogdGhlX3Jlc3BvbnNlIH0pLFxyXG4gIH07XHJcbiAgcmV0dXJuIGNvcnNfcmVzcDtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGNoZWNrTm9TcWxXb3JrKHJlc3BvbnNlX2pzb246IGFueSkge1xyXG4gIGlmIChyZXNwb25zZV9qc29uLmhhc093blByb3BlcnR5KCdtZXNzYWdlJykpIHtcclxuICAgIGNvbnN0IGVycl9tZXNzID0gcmVzcG9uc2VfanNvbi5tZXNzYWdlO1xyXG4gICAgaWYgKGVycl9tZXNzLnN0YXJ0c1dpdGgoXCJJbmFjY2Vzc2libGUgaG9zdDpcIikpIHtcclxuICAgICAgY29uc29sZS5sb2coXCIqKioqIElzICdEREIgbG9jYWwnIHR1cm5lZCBvbiBpbiBOb1NRTCBXb3JrYmVuY2g/XCIpO1xyXG4gICAgICBjb25zb2xlLmxvZyhcIioqKiogSXMgdGhlcmUgYSBWUE4gcnVubmluZz9cIik7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5jb25zdCBjcmVhdGVBcHAgPSAoKSA9PiB7XHJcbiAgY29uc3QgYXBwID0gZXhwcmVzcygpO1xyXG4gIGFwcC51c2UoY29ycygpKTtcclxuICBhcHAudXNlKGV4cHJlc3MuanNvbigpKTtcclxuXHJcbiAgYXBwLmdldCgnL2hlYWx0aCcsIGFzeW5jIChfcmVxLCByZXMpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgaGVhbHRoY2hlY2tfaGFuZGxlcigpO1xyXG4gICAgICBjb25zdCByZXNwb25zZV9qc29uID0gSlNPTi5zdHJpbmdpZnkocmVzcG9uc2UpO1xyXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQocmVzcG9uc2VfanNvbik7XHJcbiAgICB9IGNhdGNoIChlOiB1bmtub3duKSB7XHJcbiAgICAgIHJldHVybiBjb3JzUmVzcG9uc2UoXCJ0aGVfZVwiKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcblxyXG4gIGFwcC5nZXQoJy9jbGVhcicsIGFzeW5jIChfcmVxLCByZXMpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZHluYW1vX2NsZWFyX2hhbmRsZXIoKTtcclxuICAgICAgY29uc3QgcmVzcG9uc2VfanNvbiA9IEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlKTtcclxuICAgICAgY2hlY2tOb1NxbFdvcmsocmVzcG9uc2VfanNvbik7XHJcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZChyZXNwb25zZV9qc29uKTtcclxuICAgIH0gY2F0Y2ggKGU6IHVua25vd24pIHtcclxuICAgICAgcmV0dXJuIGNvcnNSZXNwb25zZShcInRoZV9lXCIpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICBhcHAuZ2V0KCcvJywgYXN5bmMgKF9yZXEsIHJlcykgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBkeW5hbW9fZ2V0X2hhbmRsZXIoKTtcclxuICAgICAgY29uc3QgcmVzcG9uc2VfanNvbiA9IEpTT04ucGFyc2UocmVzcG9uc2UuYm9keSk7XHJcbiAgICAgIGNoZWNrTm9TcWxXb3JrKHJlc3BvbnNlX2pzb24pO1xyXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQocmVzcG9uc2VfanNvbik7XHJcbiAgICB9IGNhdGNoIChlOiB1bmtub3duKSB7XHJcbiAgICAgIHJldHVybiBjb3JzUmVzcG9uc2UoXCJ0aGVfZVwiKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgYXBwLnBvc3QoJy8nLCBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IGpzb25fZGF0YSA9IHJlcS5ib2R5O1xyXG4gICAgICBjb25zdCBzdHJpbmdfZGF0YSA9IEpTT04uc3RyaW5naWZ5KGpzb25fZGF0YSk7XHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZHluYW1vX3Bvc3RfaGFuZGxlcih7IGJvZHk6IHN0cmluZ19kYXRhIH0pO1xyXG4gICAgICBjb25zdCByZXNwb25zZV9qc29uID0gSlNPTi5wYXJzZShyZXNwb25zZS5ib2R5KTtcclxuICAgICAgY2hlY2tOb1NxbFdvcmsocmVzcG9uc2VfanNvbik7XHJcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZChyZXNwb25zZV9qc29uKTtcclxuICAgIH0gY2F0Y2ggKGU6IHVua25vd24pIHtcclxuICAgICAgcmV0dXJuIGNvcnNSZXNwb25zZShcInRoZV9lXCIpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuXHJcblxyXG5cclxuICByZXR1cm4gYXBwO1xyXG59O1xyXG5cclxuY29uc3QgYXBwID0gY3JlYXRlQXBwKCk7XHJcbmNvbnN0IHNlcnZlciA9IGFwcC5saXN0ZW4ocG9ydCwgKCkgPT4ge1xyXG4gIGNvbnNvbGUuaW5mbyhgTG9jYWwgc2VydmVyIGlzIGxpc3RlbmluZyBvbiBwb3J0ICR7cG9ydH1gKTtcclxufSk7XHJcbnNlcnZlci5rZWVwQWxpdmVUaW1lb3V0ID0gMTA7XHJcbnNlcnZlci5oZWFkZXJzVGltZW91dCA9IDEwO1xyXG5jcmVhdGVBcHAoKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUFwcDtcclxuIl19