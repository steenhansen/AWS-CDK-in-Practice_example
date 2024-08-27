"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const { parsed } = dotenv_1.default.config();
const port = (parsed === null || parsed === void 0 ? void 0 : parsed.PORT) || 80;
const createApp = () => {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    return app;
};
const app = createApp();
const server = app.listen(port, () => {
    console.info(`Server is listening on port ${port}`);
});
server.keepAliveTimeout = 60;
server.headersTimeout = 60;
createApp();
exports.default = createApp;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHNEQUE4QjtBQUM5QixvREFBNEI7QUFDNUIsZ0RBQXdCO0FBSXhCLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxnQkFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBRW5DLE1BQU0sSUFBSSxHQUFHLENBQUEsTUFBTSxhQUFOLE1BQU0sdUJBQU4sTUFBTSxDQUFFLElBQUksS0FBSSxFQUFFLENBQUM7QUFFaEMsTUFBTSxTQUFTLEdBQUcsR0FBRyxFQUFFO0lBQ3JCLE1BQU0sR0FBRyxHQUFHLElBQUEsaUJBQU8sR0FBRSxDQUFDO0lBRXRCLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBQSxjQUFJLEdBQUUsQ0FBQyxDQUFDO0lBQ2hCLEdBQUcsQ0FBQyxHQUFHLENBQUMsaUJBQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBR3hCLE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQyxDQUFDO0FBRUYsTUFBTSxHQUFHLEdBQUcsU0FBUyxFQUFFLENBQUM7QUFFeEIsTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFO0lBQ25DLE9BQU8sQ0FBQyxJQUFJLENBQUMsK0JBQStCLElBQUksRUFBRSxDQUFDLENBQUM7QUFDdEQsQ0FBQyxDQUFDLENBQUM7QUFFSCxNQUFNLENBQUMsZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO0FBQzdCLE1BQU0sQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFDO0FBRTNCLFNBQVMsRUFBRSxDQUFDO0FBRVosa0JBQWUsU0FBUyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XHJcbmltcG9ydCBkb3RlbnYgZnJvbSAnZG90ZW52JztcclxuaW1wb3J0IGNvcnMgZnJvbSAnY29ycyc7XHJcblxyXG5cclxuXHJcbmNvbnN0IHsgcGFyc2VkIH0gPSBkb3RlbnYuY29uZmlnKCk7XHJcblxyXG5jb25zdCBwb3J0ID0gcGFyc2VkPy5QT1JUIHx8IDgwO1xyXG5cclxuY29uc3QgY3JlYXRlQXBwID0gKCkgPT4ge1xyXG4gIGNvbnN0IGFwcCA9IGV4cHJlc3MoKTtcclxuXHJcbiAgYXBwLnVzZShjb3JzKCkpO1xyXG4gIGFwcC51c2UoZXhwcmVzcy5qc29uKCkpO1xyXG5cclxuXHJcbiAgcmV0dXJuIGFwcDtcclxufTtcclxuXHJcbmNvbnN0IGFwcCA9IGNyZWF0ZUFwcCgpO1xyXG5cclxuY29uc3Qgc2VydmVyID0gYXBwLmxpc3Rlbihwb3J0LCAoKSA9PiB7XHJcbiAgY29uc29sZS5pbmZvKGBTZXJ2ZXIgaXMgbGlzdGVuaW5nIG9uIHBvcnQgJHtwb3J0fWApO1xyXG59KTtcclxuXHJcbnNlcnZlci5rZWVwQWxpdmVUaW1lb3V0ID0gNjA7XHJcbnNlcnZlci5oZWFkZXJzVGltZW91dCA9IDYwO1xyXG5cclxuY3JlYXRlQXBwKCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVBcHA7XHJcbiJdfQ==