import { Transform, TransformFnParams } from 'class-transformer';
import * as _ from 'lodash';

export const StringToNumber = () =>
  Transform(({ value }: TransformFnParams) => {
    if (_.isEmpty(value)) return null;
    return typeof value === 'string' ? parseInt(value) : value;
  });
