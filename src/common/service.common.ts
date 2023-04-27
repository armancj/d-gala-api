import { Injectable } from '@nestjs/common';
import * as pcg from 'generate-pincode';
import { format } from 'date-fns';

@Injectable()
export class CommonService {
  randomInt(): number {
    return Math.floor(Math.random() * (900000 - 100000 + 1)) + 100000;
  }

  setExpires(time: number): number {
    return Date.now() + time;
  }

  generateFiveDigitsRandom(): number {
    const number = Math.floor(Math.random() * 100000);
    if (number >= 10000) {
      return number;
    } else {
      return this.generateFiveDigitsRandom();
    }
  }

  generateRandomHash(): string {
    return (
      Math.random().toString(36).substr(2) +
      Math.random().toString(36).substr(2)
    );
  }

  roundDecimals(num: number, decimals: number): number {
    const numeroRegexp = new RegExp('\\d\\.(\\d){' + decimals + ',}');
    if (numeroRegexp.test(num.toString())) {
      return Number(num.toFixed(decimals));
    } else {
      return Number(num.toFixed(decimals)) === 0 ? 0 : num;
    }
  }

  generatePin(digits: number): string {
    return pcg(digits);
  }
  getInString(strings: string[]) {
    let cad = '(';
    strings.forEach((v, i) => {
      if (i == strings.length - 1) cad += `'${v}')`;
      else cad += `'${v}',`;
    });
    return cad;
  }

  betweenDates(from: Date | string, to: Date | string) {
    return Between(
      format(
        typeof from === 'string' ? new Date(from) : from,
        'YYYY-MM-DD HH:MM:SS',
      ),
      format(typeof to === 'string' ? new Date(to) : to, 'YYYY-MM-DD HH:MM:SS'),
    );
  }
}
function Between(arg0: any, arg1: any) {
  throw new Error('Function not implemented.');
}
