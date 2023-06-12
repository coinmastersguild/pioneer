// @ts-ignore
import Swagger from 'swagger-client';


class Pioneer {
    queryKey: any;
    client: any;
    pioneer: any;
    spec: any;

    constructor(spec: any, config: { queryKey: any; }) {
        this.spec = spec;
        this.queryKey = config.queryKey;
        this.pioneer = {};
    }

    async init() {
        try {
            if (!this.queryKey) throw Error(" You must create an api key! ");

            console.log("Creating Swagger client with Authorization key: " + this.queryKey);

            this.client = await new Swagger({
                url: this.spec,
                requestInterceptor: (req: { headers: { Authorization: any; }; }) => {
                    req.headers.Authorization = this.queryKey;
                    console.log("Request interceptor set headers: ", req.headers);
                    return req;
                }
            });

            Object.keys(this.client.spec.paths).forEach((path) => {
                Object.keys(this.client.spec.paths[path]).forEach((method) => {
                    

                    const operationId = this.client.spec.paths[path][method].operationId;

                    this.pioneer[operationId] = async (parameters:any) => {
                        console.log("Executing operation " + operationId + " with parameters ", parameters);
                        console.log("path: ",path)
                        console.log("method: ",method)
                        try {
                            
                            let request:any = {
                                operationId,
                                parameters: {
                                    ...parameters, // existing parameters
                                    Authorization: this.queryKey
                                },
                                responseContentType: 'application/json'
                            }
                            if(method === 'post'){
                                request.requestBody = parameters
                            }
                            console.log("request: ",request)
                            const result = await this.client.execute(request);
                            return { data: result.body };
                        } catch (e) {
                            console.error(e);
                            throw e;
                        }
                    };
                });
            });
            return this.pioneer;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }
}

export default Pioneer;

