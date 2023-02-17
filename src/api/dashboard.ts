import axios from 'axios';
import qs from 'query-string';


export interface NodeDailyRecord {
  id: string;
  total_node_count: number;
  validator_count: number;
  candidate_count: number;
  edge_count: number;
  total_storage: number;
  total_upstream_bandwidth: number;
  total_downstream_bandwidth: number;
  total_carfile: number;
  total_carfile_size: number;
  retrieval_count: number;
  time: string;
}

export interface NodeDailyParams extends Partial<NodeDailyRecord> {
  page: number;
  page_size: number;
}

export interface NodeDailyRes {
  x: string;
  y: NodeDailyRecord;
}

export function queryNodeDailyTrendData(params: NodeDailyParams) {
  return axios.get<NodeDailyRes[]>('/api/v1/admin/get_node_daily_trend', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}