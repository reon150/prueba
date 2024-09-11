import { QUERY_LIMIT } from '../constants';

export function getLimitValue(queryLimit: number): number {
  return queryLimit > QUERY_LIMIT ? QUERY_LIMIT : queryLimit;
}
