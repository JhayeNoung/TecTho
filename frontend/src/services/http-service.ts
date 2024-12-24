import { AxiosInstance } from "axios";

class HttpService{
  endpoint: string;
  axiosInstance: AxiosInstance;

  constructor(axiosInstance: AxiosInstance, endpoint: string){
    this.endpoint = endpoint
    this.axiosInstance = axiosInstance
  }
  
  get<T>(){
    const controller = new AbortController();
    const request = this.axiosInstance.get<T[]>(this.endpoint, {signal: controller.signal})
    return { request, cancle: ()=>controller.abort()}
  }

  post<T>(entity: T){
    return this.axiosInstance.post(this.endpoint, entity)
  }

  put<T>(_id: string, entity: T){
    return this.axiosInstance.put(this.endpoint+'/'+_id, entity)
  }

  delete(_id: string){
    return this.axiosInstance.delete(this.endpoint+'/'+_id)
  }
}


const create = (axiosInstance: AxiosInstance,endpoint: string)=> new HttpService(axiosInstance, endpoint);

export default create
