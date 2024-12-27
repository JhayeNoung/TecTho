import apiMovie from "./api-movie";

class HttpService{
  endpoint: string;

  constructor(endpoint: string){
    this.endpoint = endpoint
  }

  post<T>(entity: T){
    return apiMovie.post(this.endpoint, entity)
  }

  put<T>(_id: string, entity: T){
    return apiMovie.put(this.endpoint+'/'+_id, entity)
  }

  delete(_id: string){
    return apiMovie.delete(this.endpoint+'/'+_id)
  }
}


const create = (endpoint: string)=> new HttpService(endpoint);

export default create
