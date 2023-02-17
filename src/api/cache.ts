
import axios from 'axios';
import qs from 'query-string';

export interface CacheRecord {
  carfile_cid: string;
  carfile_hash: string;
  reliability: number;
  need_reliability: number;
  total_size: number;
  total_blocks: number;
  expired_time: string;
  created_time: string;
}

export interface CacheParams extends Partial<CacheRecord> {
    current: number;
    pageSize: number;
  }
  
export interface CacheListRes {
    list: CacheRecord[];
    total: number;
}
  
export function queryCacheList(params: CacheParams) {
    return axios.get<CacheListRes>('/api/v1/admin/cache_list', {
      params,
      paramsSerializer: (obj) => {
        return qs.stringify(obj);
      },
    });
}

export interface CacheInfoParams {
    carfile_cid: string | undefined;
}

export interface CarfileReplicaInfo{
    ID: string,
    CarfileHash: string     
	DeviceID:    string      
	Status:      number 
	DoneSize:    number      
	DoneBlocks:  number        
	IsCandidate: boolean       
	CreateTime:  string
	EndTime:     string 
}

export interface CacheInfoRes {
    CarfileReplicaInfos: CarfileReplicaInfo[],
}


export function queryCacheInfo(params: CacheInfoParams) {
    return axios.get<CacheInfoRes>('/api/v1/admin/cache_info', { params });
}

export interface CreateCacheParams {
    carfile_cid: string;
    reliability: number;
    expired_time: string;
}

export function createCache(params: CreateCacheParams) {
    return axios.post<CreateCacheParams>('/api/v1/admin/add_cache', params );
}

export function deleteCache(params: {carfile_cid: string}) {
    return axios.post('api/v1/admin/delete_cache', params )
}


export interface DeleteDeviceCacheParams {
    carfile_cid: string;
    device_id: string;
}

export function deleteDeviceCache(params: DeleteDeviceCacheParams) {
    return axios.post('api/v1/admin/delete_device_cache', params )
}