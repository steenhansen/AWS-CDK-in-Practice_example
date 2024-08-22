"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const createApp_1 = __importDefault(require("./createApp"));
const server_config_json_1 = __importDefault(require("./server.config.json"));
let port;
if (((_a = process.env["LOCAL_MODE"]) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === 'yes') {
    port = server_config_json_1.default.PORT_SERVER || '80';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSw0REFBcUM7QUFDckMsOEVBQTBDO0FBRTFDLElBQUksSUFBWSxDQUFDO0FBQ2pCLElBQUksQ0FBQSxNQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLDBDQUFFLFdBQVcsRUFBRSxNQUFLLEtBQUssRUFBRSxDQUFDO0lBQ3ZELElBQUksR0FBRyw0QkFBTSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUM7QUFDcEMsQ0FBQztLQUFNLENBQUM7SUFDTixJQUFJLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDO0FBRWxDLENBQUM7QUFHRCxNQUFNLEdBQUcsR0FBRyxJQUFBLG1CQUFVLEdBQUUsQ0FBQztBQUN6QixNQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUU7SUFDbkMsT0FBTyxDQUFDLElBQUksQ0FBQyxxQ0FBcUMsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUM1RCxDQUFDLENBQUMsQ0FBQztBQUNILE1BQU0sQ0FBQyxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7QUFDN0IsTUFBTSxDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUM7QUFDM0IsSUFBQSxtQkFBVSxHQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY3JlYXRlX2FwcCBmcm9tICcuL2NyZWF0ZUFwcCc7XHJcbmltcG9ydCBjb25maWcgZnJvbSAnLi9zZXJ2ZXIuY29uZmlnLmpzb24nO1xyXG5cclxubGV0IHBvcnQ6IHN0cmluZztcclxuaWYgKHByb2Nlc3MuZW52W1wiTE9DQUxfTU9ERVwiXT8udG9Mb3dlckNhc2UoKSA9PT0gJ3llcycpIHtcclxuICBwb3J0ID0gY29uZmlnLlBPUlRfU0VSVkVSIHx8ICc4MCc7XHJcbn0gZWxzZSB7XHJcbiAgcG9ydCA9IHByb2Nlc3MuZW52LlBPUlQgfHwgJzgwJztcclxuXHJcbn1cclxuXHJcblxyXG5jb25zdCBhcHAgPSBjcmVhdGVfYXBwKCk7XHJcbmNvbnN0IHNlcnZlciA9IGFwcC5saXN0ZW4ocG9ydCwgKCkgPT4ge1xyXG4gIGNvbnNvbGUuaW5mbyhgTG9jYWwgc2VydmVyIGlzIGxpc3RlbmluZyBvbiBwb3J0ICR7cG9ydH1gKTtcclxufSk7XHJcbnNlcnZlci5rZWVwQWxpdmVUaW1lb3V0ID0gMTA7XHJcbnNlcnZlci5oZWFkZXJzVGltZW91dCA9IDEwO1xyXG5jcmVhdGVfYXBwKCk7XHJcblxyXG5cclxuXHJcblxyXG4iXX0=