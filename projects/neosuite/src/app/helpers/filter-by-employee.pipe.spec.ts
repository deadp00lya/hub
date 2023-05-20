import { FilterByEmployeePipe } from './filter-by-employee.pipe';

describe('FilterByEmployeePipe', () => {
  it('create an instance', () => {
    const pipe = new FilterByEmployeePipe();
    expect(pipe).toBeTruthy();
  });
});
