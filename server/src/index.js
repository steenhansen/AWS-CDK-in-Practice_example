"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const connections_1 = require("./connections");
dotenv_1.default.config();
const port = process.env.PORT || 80;
const createApp = () => {
    const app = (0, express_1.default)();
    (0, connections_1.init)();
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.post('/', async (req, res) => {
        try {
            const { todo_name, todo_description, todo_completed } = req.body.todo;
            const sql = `
      INSERT INTO Todolist
        (
          \`todo_name\`,
          \`todo_description\`,
          \`todo_completed\`
        )
        VALUES
          (
            "${todo_name}",
            "${todo_description}",
            ${todo_completed}
          );
    `;
            const response = await (0, connections_1.execute)(sql, {});
            const { insertId } = response;
            if (!insertId)
                return res.status(400).send('Failed to insert todo');
            const todo = {
                id: insertId,
                todo_completed,
                todo_description,
                todo_name,
            };
            return res.status(200).send({
                todo,
            });
        }
        catch (err) {
            console.log(err);
            return res.status(400).send({
                message: err.message,
            });
        }
    });
    app.get('/', async (_, res) => {
        try {
            const sql = `SELECT * FROM Todolist;`;
            const response = await (0, connections_1.execute)(sql, {});
            return res.status(200).send({ todos: response });
        }
        catch (err) {
            console.log(err);
            return res.status(400).send({
                message: err.message,
            });
        }
    });
    app.get('/health', async (_, res) => {
        return res.status(200).send({ status: 'available' });
    });
    return app;
};
const app = createApp();
const server = app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
server.keepAliveTimeout = 30000;
server.headersTimeout = 31000;
createApp();
exports.default = createApp;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHNEQUE4QjtBQUM5QixvREFBNEI7QUFDNUIsZ0RBQXdCO0FBS3hCLCtDQUE4QztBQUU5QyxnQkFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBRWhCLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQztBQUVwQyxNQUFNLFNBQVMsR0FBRyxHQUFHLEVBQUU7SUFDckIsTUFBTSxHQUFHLEdBQUcsSUFBQSxpQkFBTyxHQUFFLENBQUM7SUFFdEIsSUFBQSxrQkFBSSxHQUFFLENBQUM7SUFFUCxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUEsY0FBSSxHQUFFLENBQUMsQ0FBQztJQUNoQixHQUFHLENBQUMsR0FBRyxDQUFDLGlCQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUV4QixHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO1FBQy9CLElBQUk7WUFDRixNQUFNLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixFQUFFLGNBQWMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBRXRFLE1BQU0sR0FBRyxHQUFHOzs7Ozs7Ozs7ZUFTSCxTQUFTO2VBQ1QsZ0JBQWdCO2NBQ2pCLGNBQWM7O0tBRXZCLENBQUM7WUFFQSxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUEscUJBQU8sRUFBVyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFFbEQsTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLFFBQVEsQ0FBQztZQUU5QixJQUFJLENBQUMsUUFBUTtnQkFBRSxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLENBQUM7WUFFcEUsTUFBTSxJQUFJLEdBQVM7Z0JBQ2pCLEVBQUUsRUFBRSxRQUFRO2dCQUNaLGNBQWM7Z0JBQ2QsZ0JBQWdCO2dCQUNoQixTQUFTO2FBQ1YsQ0FBQztZQUVGLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQzFCLElBQUk7YUFDTCxDQUFDLENBQUM7U0FDSjtRQUFDLE9BQU8sR0FBUSxFQUFFO1lBQ2pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFakIsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDMUIsT0FBTyxFQUFFLEdBQUcsQ0FBQyxPQUFPO2FBQ3JCLENBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFFSCxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFO1FBQzVCLElBQUk7WUFDRixNQUFNLEdBQUcsR0FBRyx5QkFBeUIsQ0FBQztZQUV0QyxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUEscUJBQU8sRUFBTyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFFOUMsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO1NBQ2xEO1FBQUMsT0FBTyxHQUFRLEVBQUU7WUFDakIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUVqQixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUMxQixPQUFPLEVBQUUsR0FBRyxDQUFDLE9BQU87YUFDckIsQ0FBQyxDQUFDO1NBQ0o7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUVILEdBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUU7UUFDbEMsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZELENBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDLENBQUM7QUFFRixNQUFNLEdBQUcsR0FBRyxTQUFTLEVBQUUsQ0FBQztBQUV4QixNQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUU7SUFDbkMsT0FBTyxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUNyRCxDQUFDLENBQUMsQ0FBQztBQUVILE1BQU0sQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7QUFDaEMsTUFBTSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7QUFFOUIsU0FBUyxFQUFFLENBQUM7QUFFWixrQkFBZSxTQUFTLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJztcclxuaW1wb3J0IGRvdGVudiBmcm9tICdkb3RlbnYnO1xyXG5pbXBvcnQgY29ycyBmcm9tICdjb3JzJztcclxuaW1wb3J0IHsgT2tQYWNrZXQgfSBmcm9tICdteXNxbCc7XHJcblxyXG5pbXBvcnQgeyBUb2RvIH0gZnJvbSAnLi9AdHlwZXMnO1xyXG5cclxuaW1wb3J0IHsgZXhlY3V0ZSwgaW5pdCB9IGZyb20gJy4vY29ubmVjdGlvbnMnO1xyXG5cclxuZG90ZW52LmNvbmZpZygpO1xyXG5cclxuY29uc3QgcG9ydCA9IHByb2Nlc3MuZW52LlBPUlQgfHwgODA7XHJcblxyXG5jb25zdCBjcmVhdGVBcHAgPSAoKSA9PiB7XHJcbiAgY29uc3QgYXBwID0gZXhwcmVzcygpO1xyXG5cclxuICBpbml0KCk7XHJcblxyXG4gIGFwcC51c2UoY29ycygpKTtcclxuICBhcHAudXNlKGV4cHJlc3MuanNvbigpKTtcclxuXHJcbiAgYXBwLnBvc3QoJy8nLCBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHsgdG9kb19uYW1lLCB0b2RvX2Rlc2NyaXB0aW9uLCB0b2RvX2NvbXBsZXRlZCB9ID0gcmVxLmJvZHkudG9kbztcclxuXHJcbiAgICAgIGNvbnN0IHNxbCA9IGBcclxuICAgICAgSU5TRVJUIElOVE8gVG9kb2xpc3RcclxuICAgICAgICAoXHJcbiAgICAgICAgICBcXGB0b2RvX25hbWVcXGAsXHJcbiAgICAgICAgICBcXGB0b2RvX2Rlc2NyaXB0aW9uXFxgLFxyXG4gICAgICAgICAgXFxgdG9kb19jb21wbGV0ZWRcXGBcclxuICAgICAgICApXHJcbiAgICAgICAgVkFMVUVTXHJcbiAgICAgICAgICAoXHJcbiAgICAgICAgICAgIFwiJHt0b2RvX25hbWV9XCIsXHJcbiAgICAgICAgICAgIFwiJHt0b2RvX2Rlc2NyaXB0aW9ufVwiLFxyXG4gICAgICAgICAgICAke3RvZG9fY29tcGxldGVkfVxyXG4gICAgICAgICAgKTtcclxuICAgIGA7XHJcblxyXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGV4ZWN1dGU8T2tQYWNrZXQ+KHNxbCwge30pO1xyXG5cclxuICAgICAgY29uc3QgeyBpbnNlcnRJZCB9ID0gcmVzcG9uc2U7XHJcblxyXG4gICAgICBpZiAoIWluc2VydElkKSByZXR1cm4gcmVzLnN0YXR1cyg0MDApLnNlbmQoJ0ZhaWxlZCB0byBpbnNlcnQgdG9kbycpO1xyXG5cclxuICAgICAgY29uc3QgdG9kbzogVG9kbyA9IHtcclxuICAgICAgICBpZDogaW5zZXJ0SWQsXHJcbiAgICAgICAgdG9kb19jb21wbGV0ZWQsXHJcbiAgICAgICAgdG9kb19kZXNjcmlwdGlvbixcclxuICAgICAgICB0b2RvX25hbWUsXHJcbiAgICAgIH07XHJcblxyXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoe1xyXG4gICAgICAgIHRvZG8sXHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCAoZXJyOiBhbnkpIHtcclxuICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuXHJcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwMCkuc2VuZCh7XHJcbiAgICAgICAgbWVzc2FnZTogZXJyLm1lc3NhZ2UsXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICBhcHAuZ2V0KCcvJywgYXN5bmMgKF8sIHJlcykgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3Qgc3FsID0gYFNFTEVDVCAqIEZST00gVG9kb2xpc3Q7YDtcclxuXHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZXhlY3V0ZTxUb2RvPihzcWwsIHt9KTtcclxuXHJcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCh7IHRvZG9zOiByZXNwb25zZSB9KTtcclxuICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcblxyXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLnNlbmQoe1xyXG4gICAgICAgIG1lc3NhZ2U6IGVyci5tZXNzYWdlLFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgYXBwLmdldCgnL2hlYWx0aCcsIGFzeW5jIChfLCByZXMpID0+IHtcclxuICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCh7IHN0YXR1czogJ2F2YWlsYWJsZScgfSk7XHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiBhcHA7XHJcbn07XHJcblxyXG5jb25zdCBhcHAgPSBjcmVhdGVBcHAoKTtcclxuXHJcbmNvbnN0IHNlcnZlciA9IGFwcC5saXN0ZW4ocG9ydCwgKCkgPT4ge1xyXG4gIGNvbnNvbGUubG9nKGBTZXJ2ZXIgaXMgbGlzdGVuaW5nIG9uIHBvcnQgJHtwb3J0fWApO1xyXG59KTtcclxuXHJcbnNlcnZlci5rZWVwQWxpdmVUaW1lb3V0ID0gMzAwMDA7XHJcbnNlcnZlci5oZWFkZXJzVGltZW91dCA9IDMxMDAwO1xyXG5cclxuY3JlYXRlQXBwKCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVBcHA7XHJcbiJdfQ==