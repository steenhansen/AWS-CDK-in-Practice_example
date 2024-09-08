"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const createApp_1 = __importDefault(require("./createApp"));
const program_constants_json_1 = __importDefault(require("../../cdk/program.constants.json"));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSw0REFBcUM7QUFDckMsOEZBQTZEO0FBRTdELElBQUksSUFBWSxDQUFDO0FBQ2pCLElBQUksQ0FBQSxNQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsMENBQUUsV0FBVyxFQUFFLE1BQUssS0FBSyxFQUFFLENBQUM7SUFDOUQsSUFBSSxHQUFHLGdDQUFhLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQztBQUMzQyxDQUFDO0tBQU0sQ0FBQztJQUNOLElBQUksR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUM7QUFDbEMsQ0FBQztBQUVELE1BQU0sR0FBRyxHQUFHLElBQUEsbUJBQVUsR0FBRSxDQUFDO0FBQ3pCLE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRTtJQUNuQyxPQUFPLENBQUMsSUFBSSxDQUFDLHFDQUFxQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQzVELENBQUMsQ0FBQyxDQUFDO0FBQ0gsTUFBTSxDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztBQUM3QixNQUFNLENBQUMsY0FBYyxHQUFHLEVBQUUsQ0FBQztBQUMzQixJQUFBLG1CQUFVLEdBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjcmVhdGVfYXBwIGZyb20gJy4vY3JlYXRlQXBwJztcclxuaW1wb3J0IHRoZV9jb25zdGFudHMgZnJvbSAnLi4vLi4vY2RrL3Byb2dyYW0uY29uc3RhbnRzLmpzb24nO1xyXG5cclxubGV0IHBvcnQ6IHN0cmluZztcclxuaWYgKHByb2Nlc3MuZW52W1wiU0VSVkVSX0xPQ0FMX01PREVcIl0/LnRvTG93ZXJDYXNlKCkgPT09ICd5ZXMnKSB7XHJcbiAgcG9ydCA9IHRoZV9jb25zdGFudHMuUE9SVF9TRVJWRVIgfHwgJzgwJztcclxufSBlbHNlIHtcclxuICBwb3J0ID0gcHJvY2Vzcy5lbnYuUE9SVCB8fCAnODAnO1xyXG59XHJcblxyXG5jb25zdCBhcHAgPSBjcmVhdGVfYXBwKCk7XHJcbmNvbnN0IHNlcnZlciA9IGFwcC5saXN0ZW4ocG9ydCwgKCkgPT4ge1xyXG4gIGNvbnNvbGUuaW5mbyhgTG9jYWwgc2VydmVyIGlzIGxpc3RlbmluZyBvbiBwb3J0ICR7cG9ydH1gKTtcclxufSk7XHJcbnNlcnZlci5rZWVwQWxpdmVUaW1lb3V0ID0gMTA7XHJcbnNlcnZlci5oZWFkZXJzVGltZW91dCA9IDEwO1xyXG5jcmVhdGVfYXBwKCk7XHJcblxyXG4iXX0=