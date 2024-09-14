import { QUERY_LIMIT } from '../constants';
import { getLimitValue } from './pagination';

describe('Pagination', () => {
  describe('getLimitValue', () => {
    it('should return the passed queryLimit if it is less than QUERY_LIMIT', () => {
      const queryLimit = QUERY_LIMIT - 1;
      const result = getLimitValue(queryLimit);
      expect(result).toEqual(queryLimit);
    });

    it('should return QUERY_LIMIT if the passed queryLimit is greater than QUERY_LIMIT', () => {
      const queryLimit = QUERY_LIMIT + 1;
      const result = getLimitValue(queryLimit);
      expect(result).toEqual(QUERY_LIMIT);
    });

    it('should return QUERY_LIMIT if the passed queryLimit is equal to QUERY_LIMIT', () => {
      const queryLimit = QUERY_LIMIT;
      const result = getLimitValue(queryLimit);
      expect(result).toEqual(QUERY_LIMIT);
    });
  });
});
