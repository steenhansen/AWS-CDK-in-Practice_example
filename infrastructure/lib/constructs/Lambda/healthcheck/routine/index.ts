import { httpResponse } from '../../handlers/httpResponse';


export const healthcheck_handler = async () => {
  try {
    return httpResponse(200, JSON.stringify('Health-OK'));  // constant
  } catch (error: any) {
    console.error(error);

    return httpResponse(400, JSON.stringify({ message: error.message }));
  }
};
