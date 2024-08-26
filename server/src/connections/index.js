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
            host: process.env.RDS_HOST || host,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxrREFBb0M7QUFDcEMsb0RBQTRCO0FBQzVCLDRFQUl5QztBQUV6QyxnQkFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBRWhCLElBQUksSUFBVSxDQUFDO0FBRWYsTUFBTSxPQUFPLEdBQUcsSUFBSSw2Q0FBb0IsQ0FBQztJQUN2QyxNQUFNLEVBQUUsV0FBVztDQUNwQixDQUFDLENBQUM7QUFFSCxNQUFNLGNBQWMsR0FBRyxLQUFLLEVBQUUsUUFBZ0IsRUFBRSxFQUFFO0lBQ2hELE1BQU0sTUFBTSxHQUErQjtRQUN6QyxRQUFRLEVBQUUsUUFBUTtLQUNuQixDQUFDO0lBRUYsTUFBTSxPQUFPLEdBQUcsSUFBSSw4Q0FBcUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUVsRCxNQUFNLEVBQUUsWUFBWSxFQUFFLEdBQUcsTUFBTSxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRXJELElBQUksQ0FBQyxZQUFZO1FBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0lBRTVELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNsQyxDQUFDLENBQUM7QUFFSyxNQUFNLElBQUksR0FBRyxHQUFHLEVBQUU7SUFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FDVCxZQUFZLEVBQ1osaUNBQWlDLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQ3hELENBQUM7SUFDRixjQUFjLENBQUMsaUNBQWlDLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDcEUsSUFBSSxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUU7UUFDckMsSUFBSSxHQUFHLGVBQUssQ0FBQyxVQUFVLENBQUM7WUFDdEIsSUFBSSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxJQUFJLElBQUk7WUFDbEMsSUFBSSxFQUFFLFFBQVE7WUFDZCxRQUFRO1lBQ1Isa0JBQWtCLEVBQUUsSUFBSTtZQUN4QixJQUFJLEVBQUUsSUFBSTtZQUNWLFFBQVEsRUFBRSxVQUFVO1NBQ3JCLENBQUMsQ0FBQztRQUVILE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQyxDQUFDO1NBQ0QsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ2IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVuQixPQUFPLENBQUMsQ0FBQztJQUNYLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDO0FBdkJXLFFBQUEsSUFBSSxRQXVCZjtBQUVLLE1BQU0sT0FBTyxHQUFHLENBQ3JCLEtBQWEsRUFDYixNQUEwQyxFQUM5QixFQUFFO0lBQ2QsSUFBSTtRQUNGLElBQUksQ0FBQyxJQUFJO1lBQ1AsTUFBTSxJQUFJLEtBQUssQ0FDYixvRUFBb0UsQ0FDckUsQ0FBQztRQUVKLE9BQU8sSUFBSSxPQUFPLENBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDeEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFO2dCQUMzQyxJQUFJLEtBQUssRUFBRTtvQkFDVCxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUNuQixNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUN6Qjs7b0JBQU0sT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzFCLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7S0FDSjtJQUFDLE9BQU8sS0FBSyxFQUFFO1FBQ2QsT0FBTyxDQUFDLEtBQUssQ0FBQyxxQ0FBcUMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM1RCxNQUFNLElBQUksS0FBSyxDQUFDLCtCQUErQixDQUFDLENBQUM7S0FDbEQ7QUFDSCxDQUFDLENBQUM7QUF0QlcsUUFBQSxPQUFPLFdBc0JsQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBteXNxbCwgeyBQb29sIH0gZnJvbSAnbXlzcWwnO1xyXG5pbXBvcnQgZG90ZW52IGZyb20gJ2RvdGVudic7XHJcbmltcG9ydCB7XHJcbiAgR2V0U2VjcmV0VmFsdWVDb21tYW5kLFxyXG4gIEdldFNlY3JldFZhbHVlQ29tbWFuZElucHV0LFxyXG4gIFNlY3JldHNNYW5hZ2VyQ2xpZW50LFxyXG59IGZyb20gJ0Bhd3Mtc2RrL2NsaWVudC1zZWNyZXRzLW1hbmFnZXInO1xyXG5cclxuZG90ZW52LmNvbmZpZygpO1xyXG5cclxubGV0IHBvb2w6IFBvb2w7XHJcblxyXG5jb25zdCBzZWNyZXRzID0gbmV3IFNlY3JldHNNYW5hZ2VyQ2xpZW50KHtcclxuICByZWdpb246ICd1cy1lYXN0LTEnLFxyXG59KTtcclxuXHJcbmNvbnN0IGdldFNlY3JldFZhbHVlID0gYXN5bmMgKHNlY3JldElkOiBzdHJpbmcpID0+IHtcclxuICBjb25zdCBwYXJhbXM6IEdldFNlY3JldFZhbHVlQ29tbWFuZElucHV0ID0ge1xyXG4gICAgU2VjcmV0SWQ6IHNlY3JldElkLFxyXG4gIH07XHJcblxyXG4gIGNvbnN0IGNvbW1hbmQgPSBuZXcgR2V0U2VjcmV0VmFsdWVDb21tYW5kKHBhcmFtcyk7XHJcblxyXG4gIGNvbnN0IHsgU2VjcmV0U3RyaW5nIH0gPSBhd2FpdCBzZWNyZXRzLnNlbmQoY29tbWFuZCk7XHJcblxyXG4gIGlmICghU2VjcmV0U3RyaW5nKSB0aHJvdyBuZXcgRXJyb3IoJ1NlY3JldFN0cmluZyBpcyBlbXB0eScpO1xyXG5cclxuICByZXR1cm4gSlNPTi5wYXJzZShTZWNyZXRTdHJpbmcpO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGluaXQgPSAoKSA9PiB7XHJcbiAgY29uc29sZS5sb2coXHJcbiAgICAnU2VjcmV0SWQ6ICcsXHJcbiAgICBgY2hhcHRlci01L3Jkcy9teS1zcWwtaW5zdGFuY2UtJHtwcm9jZXNzLmVudi5OT0RFX0VOVn1gLFxyXG4gICk7XHJcbiAgZ2V0U2VjcmV0VmFsdWUoYGNoYXB0ZXItNS9yZHMvbXktc3FsLWluc3RhbmNlLSR7cHJvY2Vzcy5lbnYuTk9ERV9FTlZ9YClcclxuICAgIC50aGVuKCh7IHBhc3N3b3JkLCB1c2VybmFtZSwgaG9zdCB9KSA9PiB7XHJcbiAgICAgIHBvb2wgPSBteXNxbC5jcmVhdGVQb29sKHtcclxuICAgICAgICBob3N0OiBwcm9jZXNzLmVudi5SRFNfSE9TVCB8fCBob3N0LFxyXG4gICAgICAgIHVzZXI6IHVzZXJuYW1lLFxyXG4gICAgICAgIHBhc3N3b3JkLFxyXG4gICAgICAgIG11bHRpcGxlU3RhdGVtZW50czogdHJ1ZSxcclxuICAgICAgICBwb3J0OiAzMzA2LFxyXG4gICAgICAgIGRhdGFiYXNlOiAndG9kb2xpc3QnLFxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHJldHVybiBwb29sO1xyXG4gICAgfSlcclxuICAgIC5jYXRjaChlcnJvciA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuXHJcbiAgICAgIHJldHVybiAwO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgZXhlY3V0ZSA9IDxUPihcclxuICBxdWVyeTogc3RyaW5nLFxyXG4gIHBhcmFtczogc3RyaW5nW10gfCBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPixcclxuKTogUHJvbWlzZTxUPiA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGlmICghcG9vbClcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAgICdQb29sIHdhcyBub3QgY3JlYXRlZC4gRW5zdXJlIHBvb2wgaXMgY3JlYXRlZCB3aGVuIHJ1bm5pbmcgdGhlIGFwcC4nLFxyXG4gICAgICApO1xyXG5cclxuICAgIHJldHVybiBuZXcgUHJvbWlzZTxUPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIHBvb2wucXVlcnkocXVlcnksIHBhcmFtcywgKGVycm9yLCByZXN1bHRzKSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgICAgICByZWplY3QocHJvY2Vzcy5leGl0KDEpKTtcclxuICAgICAgICB9IGVsc2UgcmVzb2x2ZShyZXN1bHRzKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcignW215c3FsLmNvbm5lY3Rvcl1bZXhlY3V0ZV1bRXJyb3JdOiAnLCBlcnJvcik7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2ZhaWxlZCB0byBleGVjdXRlIE15U1FMIHF1ZXJ5Jyk7XHJcbiAgfVxyXG59O1xyXG4iXX0=