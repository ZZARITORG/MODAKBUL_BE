import { Transform, TransformFnParams } from 'class-transformer';
import * as _ from 'lodash';

export const HyphenTel = () =>
  Transform(({ value }: TransformFnParams) => {
    if (_.isEmpty(value)) return null;

    const nonHyphenTel = value.replace(/\D/g, '');

    if (!nonHyphenTel.startsWith('010')) {
      if (nonHyphenTel.startsWith('10')) {
        return '0' + nonHyphenTel;
      }
      throw new Error('유효하지 않은 휴대폰 번호 형식입니다');
    }

    return nonHyphenTel;
  });
