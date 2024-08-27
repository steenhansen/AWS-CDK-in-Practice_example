"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.init = void 0;
const mysql_1 = __importDefault(require("mysql"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_secrets_manager_1 = require("@aws-sdk/client-secrets-manager");
dotenv_1.default.config();
let pool;
const secrets = new client_secrets_manager_1.SecretsManagerClient({
    region: 'us-east-1',
});
const getSecretValue = async (secretId) => {
    const params = {
        SecretId: secretId,
    };
    const command = new client_secrets_manager_1.GetSecretValueCommand(params);
    const { SecretString } = await secrets.send(command);
    if (!SecretString)
        throw new Error('SecretString is empty');
    return JSON.parse(SecretString);
};
const init = () => {
    console.log('SecretId: ', `chapter-5/rds/my-sql-instance-${process.env.NODE_ENV}`);
    getSecretValue(`chapter-5/rds/my-sql-instance-${process.env.NODE_ENV}`)
        .then(({ password, username, host }) => {
        pool = mysql_1.default.createPool({
            host,
            user: username,
            password,
            multipleStatements: true,
            port: 3306,
            database: 'todolist',
        });
        return pool;
    })
        .catch(error => {
        console.log(error);
        return 0;
    });
};
exports.init = init;
const execute = (query, params) => {
    try {
        if (!pool)
            throw new Error('Pool was not created. Ensure pool is created when running the app.');
        return new Promise((resolve, reject) => {
            pool.query(query, params, (error, results) => {
                if (error) {
                    console.log(error);
                    reject(process.exit(1));
                }
                else
                    resolve(results);
            });
        });
    }
    catch (error) {
        console.error('[mysql.connector][execute][Error]: ', error);
        throw new Error('failed to execute MySQL query');
    }
};
exports.execute = execute;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxrREFBb0M7QUFDcEMsb0RBQTRCO0FBQzVCLDRFQUl5QztBQUV6QyxnQkFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBRWhCLElBQUksSUFBVSxDQUFDO0FBRWYsTUFBTSxPQUFPLEdBQUcsSUFBSSw2Q0FBb0IsQ0FBQztJQUN2QyxNQUFNLEVBQUUsV0FBVztDQUNwQixDQUFDLENBQUM7QUFFSCxNQUFNLGNBQWMsR0FBRyxLQUFLLEVBQUUsUUFBZ0IsRUFBRSxFQUFFO0lBQ2hELE1BQU0sTUFBTSxHQUErQjtRQUN6QyxRQUFRLEVBQUUsUUFBUTtLQUNuQixDQUFDO0lBRUYsTUFBTSxPQUFPLEdBQUcsSUFBSSw4Q0FBcUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUVsRCxNQUFNLEVBQUUsWUFBWSxFQUFFLEdBQUcsTUFBTSxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRXJELElBQUksQ0FBQyxZQUFZO1FBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0lBRTVELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNsQyxDQUFDLENBQUM7QUFFSyxNQUFNLElBQUksR0FBRyxHQUFHLEVBQUU7SUFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FDVCxZQUFZLEVBQ1osaUNBQWlDLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQ3hELENBQUM7SUFDRixjQUFjLENBQUMsaUNBQWlDLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDcEUsSUFBSSxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUU7UUFDckMsSUFBSSxHQUFHLGVBQUssQ0FBQyxVQUFVLENBQUM7WUFDdEIsSUFBSTtZQUNKLElBQUksRUFBRSxRQUFRO1lBQ2QsUUFBUTtZQUNSLGtCQUFrQixFQUFFLElBQUk7WUFDeEIsSUFBSSxFQUFFLElBQUk7WUFDVixRQUFRLEVBQUUsVUFBVTtTQUNyQixDQUFDLENBQUM7UUFFSCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUMsQ0FBQztTQUNELEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUNiLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFbkIsT0FBTyxDQUFDLENBQUM7SUFDWCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQztBQXZCVyxRQUFBLElBQUksUUF1QmY7QUFFSyxNQUFNLE9BQU8sR0FBRyxDQUNyQixLQUFhLEVBQ2IsTUFBMEMsRUFDOUIsRUFBRTtJQUNkLElBQUk7UUFDRixJQUFJLENBQUMsSUFBSTtZQUNQLE1BQU0sSUFBSSxLQUFLLENBQ2Isb0VBQW9FLENBQ3JFLENBQUM7UUFFSixPQUFPLElBQUksT0FBTyxDQUFJLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQ3hDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsRUFBRTtnQkFDM0MsSUFBSSxLQUFLLEVBQUU7b0JBQ1QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDbkIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDekI7O29CQUFNLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUMxQixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0tBQ0o7SUFBQyxPQUFPLEtBQUssRUFBRTtRQUNkLE9BQU8sQ0FBQyxLQUFLLENBQUMscUNBQXFDLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDNUQsTUFBTSxJQUFJLEtBQUssQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0tBQ2xEO0FBQ0gsQ0FBQyxDQUFDO0FBdEJXLFFBQUEsT0FBTyxXQXNCbEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbXlzcWwsIHsgUG9vbCB9IGZyb20gJ215c3FsJztcclxuaW1wb3J0IGRvdGVudiBmcm9tICdkb3RlbnYnO1xyXG5pbXBvcnQge1xyXG4gIEdldFNlY3JldFZhbHVlQ29tbWFuZCxcclxuICBHZXRTZWNyZXRWYWx1ZUNvbW1hbmRJbnB1dCxcclxuICBTZWNyZXRzTWFuYWdlckNsaWVudCxcclxufSBmcm9tICdAYXdzLXNkay9jbGllbnQtc2VjcmV0cy1tYW5hZ2VyJztcclxuXHJcbmRvdGVudi5jb25maWcoKTtcclxuXHJcbmxldCBwb29sOiBQb29sO1xyXG5cclxuY29uc3Qgc2VjcmV0cyA9IG5ldyBTZWNyZXRzTWFuYWdlckNsaWVudCh7XHJcbiAgcmVnaW9uOiAndXMtZWFzdC0xJyxcclxufSk7XHJcblxyXG5jb25zdCBnZXRTZWNyZXRWYWx1ZSA9IGFzeW5jIChzZWNyZXRJZDogc3RyaW5nKSA9PiB7XHJcbiAgY29uc3QgcGFyYW1zOiBHZXRTZWNyZXRWYWx1ZUNvbW1hbmRJbnB1dCA9IHtcclxuICAgIFNlY3JldElkOiBzZWNyZXRJZCxcclxuICB9O1xyXG5cclxuICBjb25zdCBjb21tYW5kID0gbmV3IEdldFNlY3JldFZhbHVlQ29tbWFuZChwYXJhbXMpO1xyXG5cclxuICBjb25zdCB7IFNlY3JldFN0cmluZyB9ID0gYXdhaXQgc2VjcmV0cy5zZW5kKGNvbW1hbmQpO1xyXG5cclxuICBpZiAoIVNlY3JldFN0cmluZykgdGhyb3cgbmV3IEVycm9yKCdTZWNyZXRTdHJpbmcgaXMgZW1wdHknKTtcclxuXHJcbiAgcmV0dXJuIEpTT04ucGFyc2UoU2VjcmV0U3RyaW5nKTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBpbml0ID0gKCkgPT4ge1xyXG4gIGNvbnNvbGUubG9nKFxyXG4gICAgJ1NlY3JldElkOiAnLFxyXG4gICAgYGNoYXB0ZXItNS9yZHMvbXktc3FsLWluc3RhbmNlLSR7cHJvY2Vzcy5lbnYuTk9ERV9FTlZ9YCxcclxuICApO1xyXG4gIGdldFNlY3JldFZhbHVlKGBjaGFwdGVyLTUvcmRzL215LXNxbC1pbnN0YW5jZS0ke3Byb2Nlc3MuZW52Lk5PREVfRU5WfWApXHJcbiAgICAudGhlbigoeyBwYXNzd29yZCwgdXNlcm5hbWUsIGhvc3QgfSkgPT4ge1xyXG4gICAgICBwb29sID0gbXlzcWwuY3JlYXRlUG9vbCh7XHJcbiAgICAgICAgaG9zdCxcclxuICAgICAgICB1c2VyOiB1c2VybmFtZSxcclxuICAgICAgICBwYXNzd29yZCxcclxuICAgICAgICBtdWx0aXBsZVN0YXRlbWVudHM6IHRydWUsXHJcbiAgICAgICAgcG9ydDogMzMwNixcclxuICAgICAgICBkYXRhYmFzZTogJ3RvZG9saXN0JyxcclxuICAgICAgfSk7XHJcblxyXG4gICAgICByZXR1cm4gcG9vbDtcclxuICAgIH0pXHJcbiAgICAuY2F0Y2goZXJyb3IgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcblxyXG4gICAgICByZXR1cm4gMDtcclxuICAgIH0pO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGV4ZWN1dGUgPSA8VD4oXHJcbiAgcXVlcnk6IHN0cmluZyxcclxuICBwYXJhbXM6IHN0cmluZ1tdIHwgUmVjb3JkPHN0cmluZywgdW5rbm93bj4sXHJcbik6IFByb21pc2U8VD4gPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBpZiAoIXBvb2wpXHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgICAnUG9vbCB3YXMgbm90IGNyZWF0ZWQuIEVuc3VyZSBwb29sIGlzIGNyZWF0ZWQgd2hlbiBydW5uaW5nIHRoZSBhcHAuJyxcclxuICAgICAgKTtcclxuXHJcbiAgICByZXR1cm4gbmV3IFByb21pc2U8VD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICBwb29sLnF1ZXJ5KHF1ZXJ5LCBwYXJhbXMsIChlcnJvciwgcmVzdWx0cykgPT4ge1xyXG4gICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgICAgcmVqZWN0KHByb2Nlc3MuZXhpdCgxKSk7XHJcbiAgICAgICAgfSBlbHNlIHJlc29sdmUocmVzdWx0cyk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoJ1tteXNxbC5jb25uZWN0b3JdW2V4ZWN1dGVdW0Vycm9yXTogJywgZXJyb3IpO1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdmYWlsZWQgdG8gZXhlY3V0ZSBNeVNRTCBxdWVyeScpO1xyXG4gIH1cclxufTtcclxuIl19