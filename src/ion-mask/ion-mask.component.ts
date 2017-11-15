import { IConfig, initialConfig } from './../config';
import { IonMaskService } from './../ion-mask.service';
import { Component, Inject, forwardRef, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'ion-input-mask',
  templateUrl: './ion-mask.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IonInputMaskComponent),
      multi: true
    }
  ]
})
export class IonInputMaskComponent implements ControlValueAccessor, OnInit {
  @Input() placeholder: string;
  @Input() label: string;
  @Input() typeLabel = '';
  @Input() typeInput = '';
  @Input() clearInput = false;
  @Input() lastChild = false;
  @Input() disabled = false;

  @Input() mask;
  @Input() specialCharacters;
  @Input() patterns;
  @Input() dropSpecialCharacters;
  @Input() clearIfNotMatch: IConfig['clearIfNotMatch'] = false;

  public valueIonInput: string;

  private ionMaskService: IonMaskService;

  private value: string;
  private propagateChange = (_: any) => { };


  constructor() {
    this.ionMaskService = new IonMaskService();
  }

  public registerOnTouched() {}

  public writeValue(obj: string) {
    this.valueIonInput = this.ionMaskService.applyMask(obj, this.mask);
    if (obj) {
      this.keyUpEvent(null);
      this.value = obj;
    } else {
      this.value = null;
    }
  }

  public registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  public onChange(event?) {
    if (!this.valueIonInput) {
      this.value = null;
    } else {
      this.value = this.valueIonInput;
      if (this.dropSpecialCharacters) {
        this.value = this.ionMaskService.removeMask(this.valueIonInput);
      }
    }
    this.propagateChange(this.value);
  }

  public onBlur(event) {
    if (this.clearIfNotMatch &&
      this.ionMaskService.isNotMatch(this.mask, this.valueIonInput)) {
      this.valueIonInput = '';
      this.onChange();
    }
  }

  public keyUpEvent(event) {
    this.valueIonInput = this.ionMaskService.applyMask(this.valueIonInput, this.mask);
    this.onChange(event);
  }

  public getAttrTypeInput() {
    return this.typeInput || 'text';
  }

  public getAttrLabel(type: string) {
    return this.typeLabel === type;
  }

  public getAttrClearInput() {
    return this.clearInput ? '' : null;
  }

  public getAttrPlaceholder() {
    return this.placeholder ? this.placeholder : '';
  }

  private _setPropService() {
    this._setProp('maskSpecialCharacters', this.specialCharacters);
    this._setProp('maskAvailablePatterns', this.patterns);
    if (this.dropSpecialCharacters === undefined) {
      this.dropSpecialCharacters = this.ionMaskService.dropSpecialCharacters;
    }
    if (this.clearIfNotMatch === undefined) {
      this.clearIfNotMatch = this.ionMaskService.clearIfNotMatch;
    }
  }

  private _setProp(nameProp, prop) {
    if (prop) {
      this.ionMaskService[nameProp] = prop;
    }
  }

  public ngOnInit(): void {
    this._setPropService();
  }

}
