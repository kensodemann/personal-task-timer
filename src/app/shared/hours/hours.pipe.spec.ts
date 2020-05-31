import { HoursPipe } from './hours.pipe';

describe('HoursPipe', () => {
  it('create an instance', () => {
    const pipe = new HoursPipe();
    expect(pipe).toBeTruthy();
  });

  it('displays single digit minutes as 0:0X', () => {
    const pipe = new HoursPipe();
    expect(pipe.transform(4)).toEqual('0:04');
  });

  it('displays double digit minutes as 0:XY', () => {
    const pipe = new HoursPipe();
    expect(pipe.transform(34)).toEqual('0:34');
  });

  it('displays hours plus single digit minutes as X:0Y', () => {
    const pipe = new HoursPipe();
    expect(pipe.transform(125)).toEqual('2:05');
  });

  it('displays hours plus double digit minutes as X:YZ', () => {
    const pipe = new HoursPipe();
    expect(pipe.transform(197)).toEqual('3:17');
    expect(pipe.transform(108)).toEqual('1:48');
  });

  it('returns undefined if the value passed is undefined', () => {
    const pipe = new HoursPipe();
    expect(pipe.transform(undefined)).toEqual(undefined);
  });

  it('displays 0 minutes as 0:00', () => {
    const pipe = new HoursPipe();
    expect(pipe.transform(0)).toEqual('0:00');
  });
});
