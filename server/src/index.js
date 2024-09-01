"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const createApp_1 = __importDefault(require("./createApp"));
const program_constants_json_1 = __importDefault(require("../../infrastructure/program.constants.json"));
let port;
if (((_a = process.env["SERVER_LOCAL_MODE"]) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === 'yes') {
    port = program_constants_json_1.default.PORT_SERVER || '80';
}
else {
    port = process.env.PORT || '80';
}
const app = (0, createApp_1.default)();
const server = app.listen(port, () => {
    console.info(`Local server is listening on port ${port}`);
});
server.keepAliveTimeout = 10;
server.headersTimeout = 10;
(0, createApp_1.default)();
// import create_app from './createApp';
// import the_constants from '../../program.constants.json';
// import program_config from '../../program.config.json';
// let port: string;
// let SSM_SLACK_WEBHOOK;
// if (process.env["SERVER_LOCAL_MODE"]?.toLowerCase() === 'yes') {
//   console.log("the loco modo");
//   if (typeof process.env["SERVER_LOCAL_MODE"] !== 'undefined') {
//     SSM_SLACK_WEBHOOK = process.env["SERVER__SLACK_HOOK"];
//   } else {
//     SSM_SLACK_WEBHOOK = "un-defined";
//   }
//   port = the_constants.PORT_SERVER || '80';
// } else {
//   console.log("on the server");
//   port = process.env.PORT || '80';
// }
// const app = create_app();
// const server = app.listen(port, () => {
//   console.info(`Local server is listening on port ${port}`);
// });
// console.log("program_config", program_config);
// console.log("the_constants", the_constants);
// console.log("SSM_SLACK_WEBHOOK", SSM_SLACK_WEBHOOK);
// server.keepAliveTimeout = 10;
// server.headersTimeout = 10;
// create_app();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSw0REFBcUM7QUFFckMseUdBQXdFO0FBR3hFLElBQUksSUFBWSxDQUFDO0FBQ2pCLElBQUksQ0FBQSxNQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsMENBQUUsV0FBVyxFQUFFLE1BQUssS0FBSyxFQUFFO0lBQzdELElBQUksR0FBRyxnQ0FBYSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUM7Q0FDMUM7S0FBTTtJQUNMLElBQUksR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUM7Q0FFakM7QUFHRCxNQUFNLEdBQUcsR0FBRyxJQUFBLG1CQUFVLEdBQUUsQ0FBQztBQUN6QixNQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUU7SUFDbkMsT0FBTyxDQUFDLElBQUksQ0FBQyxxQ0FBcUMsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUM1RCxDQUFDLENBQUMsQ0FBQztBQUNILE1BQU0sQ0FBQyxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7QUFDN0IsTUFBTSxDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUM7QUFDM0IsSUFBQSxtQkFBVSxHQUFFLENBQUM7QUFHYix3Q0FBd0M7QUFHeEMsNERBQTREO0FBRTVELDBEQUEwRDtBQUUxRCxvQkFBb0I7QUFFcEIseUJBQXlCO0FBQ3pCLG1FQUFtRTtBQUNuRSxrQ0FBa0M7QUFFbEMsbUVBQW1FO0FBQ25FLDZEQUE2RDtBQUM3RCxhQUFhO0FBQ2Isd0NBQXdDO0FBQ3hDLE1BQU07QUFFTiw4Q0FBOEM7QUFDOUMsV0FBVztBQUNYLGtDQUFrQztBQUNsQyxxQ0FBcUM7QUFFckMsSUFBSTtBQUdKLDRCQUE0QjtBQUM1QiwwQ0FBMEM7QUFDMUMsK0RBQStEO0FBQy9ELE1BQU07QUFFTixpREFBaUQ7QUFDakQsK0NBQStDO0FBQy9DLHVEQUF1RDtBQUd2RCxnQ0FBZ0M7QUFDaEMsOEJBQThCO0FBQzlCLGdCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjcmVhdGVfYXBwIGZyb20gJy4vY3JlYXRlQXBwJztcclxuaW1wb3J0IGNvbmZpZyBmcm9tICcuLi8uLi9pbmZyYXN0cnVjdHVyZS9wcm9ncmFtLmNvbmZpZy5qc29uJztcclxuaW1wb3J0IHRoZV9jb25zdGFudHMgZnJvbSAnLi4vLi4vaW5mcmFzdHJ1Y3R1cmUvcHJvZ3JhbS5jb25zdGFudHMuanNvbic7XHJcblxyXG5cclxubGV0IHBvcnQ6IHN0cmluZztcclxuaWYgKHByb2Nlc3MuZW52W1wiU0VSVkVSX0xPQ0FMX01PREVcIl0/LnRvTG93ZXJDYXNlKCkgPT09ICd5ZXMnKSB7XHJcbiAgcG9ydCA9IHRoZV9jb25zdGFudHMuUE9SVF9TRVJWRVIgfHwgJzgwJztcclxufSBlbHNlIHtcclxuICBwb3J0ID0gcHJvY2Vzcy5lbnYuUE9SVCB8fCAnODAnO1xyXG5cclxufVxyXG5cclxuXHJcbmNvbnN0IGFwcCA9IGNyZWF0ZV9hcHAoKTtcclxuY29uc3Qgc2VydmVyID0gYXBwLmxpc3Rlbihwb3J0LCAoKSA9PiB7XHJcbiAgY29uc29sZS5pbmZvKGBMb2NhbCBzZXJ2ZXIgaXMgbGlzdGVuaW5nIG9uIHBvcnQgJHtwb3J0fWApO1xyXG59KTtcclxuc2VydmVyLmtlZXBBbGl2ZVRpbWVvdXQgPSAxMDtcclxuc2VydmVyLmhlYWRlcnNUaW1lb3V0ID0gMTA7XHJcbmNyZWF0ZV9hcHAoKTtcclxuXHJcblxyXG4vLyBpbXBvcnQgY3JlYXRlX2FwcCBmcm9tICcuL2NyZWF0ZUFwcCc7XHJcblxyXG5cclxuLy8gaW1wb3J0IHRoZV9jb25zdGFudHMgZnJvbSAnLi4vLi4vcHJvZ3JhbS5jb25zdGFudHMuanNvbic7XHJcblxyXG4vLyBpbXBvcnQgcHJvZ3JhbV9jb25maWcgZnJvbSAnLi4vLi4vcHJvZ3JhbS5jb25maWcuanNvbic7XHJcblxyXG4vLyBsZXQgcG9ydDogc3RyaW5nO1xyXG5cclxuLy8gbGV0IFNTTV9TTEFDS19XRUJIT09LO1xyXG4vLyBpZiAocHJvY2Vzcy5lbnZbXCJTRVJWRVJfTE9DQUxfTU9ERVwiXT8udG9Mb3dlckNhc2UoKSA9PT0gJ3llcycpIHtcclxuLy8gICBjb25zb2xlLmxvZyhcInRoZSBsb2NvIG1vZG9cIik7XHJcblxyXG4vLyAgIGlmICh0eXBlb2YgcHJvY2Vzcy5lbnZbXCJTRVJWRVJfTE9DQUxfTU9ERVwiXSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuLy8gICAgIFNTTV9TTEFDS19XRUJIT09LID0gcHJvY2Vzcy5lbnZbXCJTRVJWRVJfX1NMQUNLX0hPT0tcIl07XHJcbi8vICAgfSBlbHNlIHtcclxuLy8gICAgIFNTTV9TTEFDS19XRUJIT09LID0gXCJ1bi1kZWZpbmVkXCI7XHJcbi8vICAgfVxyXG5cclxuLy8gICBwb3J0ID0gdGhlX2NvbnN0YW50cy5QT1JUX1NFUlZFUiB8fCAnODAnO1xyXG4vLyB9IGVsc2Uge1xyXG4vLyAgIGNvbnNvbGUubG9nKFwib24gdGhlIHNlcnZlclwiKTtcclxuLy8gICBwb3J0ID0gcHJvY2Vzcy5lbnYuUE9SVCB8fCAnODAnO1xyXG5cclxuLy8gfVxyXG5cclxuXHJcbi8vIGNvbnN0IGFwcCA9IGNyZWF0ZV9hcHAoKTtcclxuLy8gY29uc3Qgc2VydmVyID0gYXBwLmxpc3Rlbihwb3J0LCAoKSA9PiB7XHJcbi8vICAgY29uc29sZS5pbmZvKGBMb2NhbCBzZXJ2ZXIgaXMgbGlzdGVuaW5nIG9uIHBvcnQgJHtwb3J0fWApO1xyXG4vLyB9KTtcclxuXHJcbi8vIGNvbnNvbGUubG9nKFwicHJvZ3JhbV9jb25maWdcIiwgcHJvZ3JhbV9jb25maWcpO1xyXG4vLyBjb25zb2xlLmxvZyhcInRoZV9jb25zdGFudHNcIiwgdGhlX2NvbnN0YW50cyk7XHJcbi8vIGNvbnNvbGUubG9nKFwiU1NNX1NMQUNLX1dFQkhPT0tcIiwgU1NNX1NMQUNLX1dFQkhPT0spO1xyXG5cclxuXHJcbi8vIHNlcnZlci5rZWVwQWxpdmVUaW1lb3V0ID0gMTA7XHJcbi8vIHNlcnZlci5oZWFkZXJzVGltZW91dCA9IDEwO1xyXG4vLyBjcmVhdGVfYXBwKCk7XHJcblxyXG5cclxuXHJcblxyXG4iXX0=