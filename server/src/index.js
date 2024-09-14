"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const createApp_1 = __importDefault(require("./createApp"));
const program_constants_json_1 = __importDefault(require("../../cicd/program.constants.json"));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFJQSw0REFBcUM7QUFDckMsK0ZBQThEO0FBSzlELElBQUksSUFBWSxDQUFDO0FBQ2pCLElBQUksQ0FBQSxNQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsMENBQUUsV0FBVyxFQUFFLE1BQUssS0FBSyxFQUFFLENBQUM7SUFDOUQsSUFBSSxHQUFHLGdDQUFhLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQztBQUMzQyxDQUFDO0tBQU0sQ0FBQztJQUNOLElBQUksR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUM7QUFDbEMsQ0FBQztBQUVELE1BQU0sR0FBRyxHQUFHLElBQUEsbUJBQVUsR0FBRSxDQUFDO0FBQ3pCLE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRTtJQUNuQyxPQUFPLENBQUMsSUFBSSxDQUFDLHFDQUFxQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQzVELENBQUMsQ0FBQyxDQUFDO0FBQ0gsTUFBTSxDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztBQUM3QixNQUFNLENBQUMsY0FBYyxHQUFHLEVBQUUsQ0FBQztBQUMzQixJQUFBLG1CQUFVLEdBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5cclxuXHJcblxyXG5pbXBvcnQgY3JlYXRlX2FwcCBmcm9tICcuL2NyZWF0ZUFwcCc7XHJcbmltcG9ydCB0aGVfY29uc3RhbnRzIGZyb20gJy4uLy4uL2NpY2QvcHJvZ3JhbS5jb25zdGFudHMuanNvbic7XHJcblxyXG5cclxuXHJcblxyXG5sZXQgcG9ydDogc3RyaW5nO1xyXG5pZiAocHJvY2Vzcy5lbnZbXCJTRVJWRVJfTE9DQUxfTU9ERVwiXT8udG9Mb3dlckNhc2UoKSA9PT0gJ3llcycpIHtcclxuICBwb3J0ID0gdGhlX2NvbnN0YW50cy5QT1JUX1NFUlZFUiB8fCAnODAnO1xyXG59IGVsc2Uge1xyXG4gIHBvcnQgPSBwcm9jZXNzLmVudi5QT1JUIHx8ICc4MCc7XHJcbn1cclxuXHJcbmNvbnN0IGFwcCA9IGNyZWF0ZV9hcHAoKTtcclxuY29uc3Qgc2VydmVyID0gYXBwLmxpc3Rlbihwb3J0LCAoKSA9PiB7XHJcbiAgY29uc29sZS5pbmZvKGBMb2NhbCBzZXJ2ZXIgaXMgbGlzdGVuaW5nIG9uIHBvcnQgJHtwb3J0fWApO1xyXG59KTtcclxuc2VydmVyLmtlZXBBbGl2ZVRpbWVvdXQgPSAxMDtcclxuc2VydmVyLmhlYWRlcnNUaW1lb3V0ID0gMTA7XHJcbmNyZWF0ZV9hcHAoKTtcclxuXHJcbiJdfQ==