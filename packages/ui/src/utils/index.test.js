import { shorter } from './index';

describe('Given shorter util function', () => {
  describe('when the function is called', () => {
    it('should return correct value', () => {
      const result1 = shorter('100.12345123545645');
      const result2 = shorter('100.12');
      const result3 = shorter('12345678');
      const result4 = shorter('123456789');
      expect(result1).toEqual('100.12...5645');
      expect(result2).toEqual('100.12');
      expect(result3).toEqual('12345678');
      // Maybe its worth to add check for float number type and its length
      expect(result4).toEqual('123456...6789');
    });
  });
});
