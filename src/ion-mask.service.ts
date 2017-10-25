import { Injectable, Inject } from '@angular/core';
import { config, IConfig } from './config';

@Injectable()
export class IonMaskService {
  public dropSpecialCharacters: IConfig['dropSpecialCharacters'];
  public clearIfNotMatch: IConfig['clearIfNotMatch'];
  public maskExpression: string = '';
  public maskSpecialCharacters: IConfig['specialCharacters'];
  public maskAvailablePatterns: IConfig['patterns'];
  private _regExpForRemove: RegExp;
  private _shift: Set<number> = new Set();

  public constructor(@Inject(config) private _config: IConfig) {
    this.clearIfNotMatch = this._config.clearIfNotMatch;
    this.dropSpecialCharacters = this._config.dropSpecialCharacters;
    this.maskSpecialCharacters = this._config!.specialCharacters;
    this.maskAvailablePatterns = this._config.patterns;
    this._regExpForRemove = new RegExp(this.maskSpecialCharacters
      .map((item: string) => `\\${item}`)
      .join('|'), 'gi');
  }

  public onTouch = () => { };

  public applyMask(inputValue: string, maskExpression: string, position: number = 0, cb: Function = () => {}): string {
    if (inputValue === undefined || inputValue === null) {
      return '';
    }

    let cursor: number = 0;
    let result: string = '';

    const inputArray: string[] = inputValue.toString()
      .split('');
    // tslint:disable-next-line
    for (let i: number = 0, inputSymbol: string = inputArray[0]; i
    < inputArray.length; i++ , inputSymbol = inputArray[i]) {
      if (result.length === maskExpression.length) {
        break;
      }

      if (this._checkSymbolMask(inputSymbol, maskExpression[cursor])) {
        result += inputSymbol;
        cursor++;
      } else if (this.maskSpecialCharacters.indexOf(maskExpression[cursor]) !== -1) {
        result += maskExpression[cursor];
        cursor++;
        this._shift.add(cursor);
        i--;
      } else if (this.maskSpecialCharacters.indexOf(inputSymbol) > -1
        && this.maskAvailablePatterns[maskExpression[cursor]]
        && this.maskAvailablePatterns[maskExpression[cursor]].optional) {
        cursor++;
        i--;
      }
    }
    if (result.length + 1 === maskExpression.length
      && this.maskSpecialCharacters.indexOf(maskExpression[maskExpression.length - 1]) !== -1) {
      result += maskExpression[maskExpression.length - 1];
    }

    let shift: number = 1;
    let newPosition: number = position + 1;
    while (this._shift.has(newPosition)) {
      shift++;
      newPosition++;
    }
    cb(this._shift.has(position) ? shift : 0);
    return result;
  }

  public isNotMatch(mask: string, value: string): boolean {
    return mask.length !== value.length;
  }

  public removeMask(value: string): string {
    if (!value) {
      return value;
    }
    return value.replace(this._regExpForRemove, '');
  }

  private _checkSymbolMask(inputSymbol: string, maskSymbol: string): boolean {
    return inputSymbol
      === maskSymbol
      || this.maskAvailablePatterns[maskSymbol] && this.maskAvailablePatterns[maskSymbol].pattern
      && this.maskAvailablePatterns[maskSymbol].pattern.test(inputSymbol);
  }
}
