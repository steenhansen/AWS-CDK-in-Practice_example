"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const createApp_1 = __importDefault(require("./createApp"));
//import config from './server.config.json';
//import program_config from '../../program.config.json';
const constants_json_1 = __importDefault(require("../../constants.json"));
let port;
if (((_a = process.env["LOCAL_MODE"]) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === 'yes') {
    console.log("the loco modo");
    port = constants_json_1.default.PORT_SERVER || '80';
}
else {
    console.log("on the server");
    port = process.env.PORT || '80';
}
const app = (0, createApp_1.default)();
const server = app.listen(port, () => {
    console.info(`Local server is listening on port ${port}`);
});
console.log("sssssssssssssssssssssss", constants_json_1.default);
console.log("sssssssssssssssssssssss", port);
server.keepAliveTimeout = 10;
server.headersTimeout = 10;
(0, createApp_1.default)();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSw0REFBcUM7QUFDckMsNENBQTRDO0FBQzVDLHlEQUF5RDtBQUV6RCwwRUFBaUQ7QUFJakQsSUFBSSxJQUFZLENBQUM7QUFDakIsSUFBSSxDQUFBLE1BQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsMENBQUUsV0FBVyxFQUFFLE1BQUssS0FBSyxFQUFFO0lBQ3RELE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDN0IsSUFBSSxHQUFHLHdCQUFhLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQztDQUMxQztLQUFNO0lBQ0wsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUM3QixJQUFJLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDO0NBRWpDO0FBR0QsTUFBTSxHQUFHLEdBQUcsSUFBQSxtQkFBVSxHQUFFLENBQUM7QUFDekIsTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFO0lBQ25DLE9BQU8sQ0FBQyxJQUFJLENBQUMscUNBQXFDLElBQUksRUFBRSxDQUFDLENBQUM7QUFDNUQsQ0FBQyxDQUFDLENBQUM7QUFFSCxPQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF5QixFQUFFLHdCQUFhLENBQUMsQ0FBQztBQUN0RCxPQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF5QixFQUFFLElBQUksQ0FBQyxDQUFDO0FBRzdDLE1BQU0sQ0FBQyxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7QUFDN0IsTUFBTSxDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUM7QUFDM0IsSUFBQSxtQkFBVSxHQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY3JlYXRlX2FwcCBmcm9tICcuL2NyZWF0ZUFwcCc7XHJcbi8vaW1wb3J0IGNvbmZpZyBmcm9tICcuL3NlcnZlci5jb25maWcuanNvbic7XHJcbi8vaW1wb3J0IHByb2dyYW1fY29uZmlnIGZyb20gJy4uLy4uL3Byb2dyYW0uY29uZmlnLmpzb24nO1xyXG5cclxuaW1wb3J0IHRoZV9jb25zdGFudHMgZnJvbSAnLi4vLi4vY29uc3RhbnRzLmpzb24nO1xyXG5cclxuXHJcblxyXG5sZXQgcG9ydDogc3RyaW5nO1xyXG5pZiAocHJvY2Vzcy5lbnZbXCJMT0NBTF9NT0RFXCJdPy50b0xvd2VyQ2FzZSgpID09PSAneWVzJykge1xyXG4gIGNvbnNvbGUubG9nKFwidGhlIGxvY28gbW9kb1wiKTtcclxuICBwb3J0ID0gdGhlX2NvbnN0YW50cy5QT1JUX1NFUlZFUiB8fCAnODAnO1xyXG59IGVsc2Uge1xyXG4gIGNvbnNvbGUubG9nKFwib24gdGhlIHNlcnZlclwiKTtcclxuICBwb3J0ID0gcHJvY2Vzcy5lbnYuUE9SVCB8fCAnODAnO1xyXG5cclxufVxyXG5cclxuXHJcbmNvbnN0IGFwcCA9IGNyZWF0ZV9hcHAoKTtcclxuY29uc3Qgc2VydmVyID0gYXBwLmxpc3Rlbihwb3J0LCAoKSA9PiB7XHJcbiAgY29uc29sZS5pbmZvKGBMb2NhbCBzZXJ2ZXIgaXMgbGlzdGVuaW5nIG9uIHBvcnQgJHtwb3J0fWApO1xyXG59KTtcclxuXHJcbmNvbnNvbGUubG9nKFwic3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3NcIiwgdGhlX2NvbnN0YW50cyk7XHJcbmNvbnNvbGUubG9nKFwic3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3NcIiwgcG9ydCk7XHJcblxyXG5cclxuc2VydmVyLmtlZXBBbGl2ZVRpbWVvdXQgPSAxMDtcclxuc2VydmVyLmhlYWRlcnNUaW1lb3V0ID0gMTA7XHJcbmNyZWF0ZV9hcHAoKTtcclxuXHJcblxyXG5cclxuXHJcbiJdfQ==