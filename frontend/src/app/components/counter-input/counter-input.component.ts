import { Component, forwardRef, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

export function counterRangeValidator(minValue: string | number, maxValue: string | number): any {
  return (c: FormControl) => {
    const err = {
      rangeError: {
        given: c.value,
        min: minValue || 0,
        max: maxValue || 10
      }
    };
    return (c.value > +maxValue || c.value < +minValue) ? err : null;
  };
}

@Component({
  selector: 'counter-input',
  templateUrl: './counter-input.component.html',
  styleUrls: ['./counter-input.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
  ],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CounterInputComponent), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => CounterInputComponent), multi: true }
  ],
  encapsulation: ViewEncapsulation.None
})
export class CounterInputComponent implements ControlValueAccessor, OnChanges {
  // tslint:disable-next-line:no-input-rename
  @Input('counterValue') _counterValue = 1;
  // tslint:disable-next-line:no-input-rename
  @Input('max') counterRangeMax: any;
  // tslint:disable-next-line:no-input-rename
  @Input('min') counterRangeMin: any;

  propagateChange: any = () => { }; // Noop function
  validateFn: any = () => { }; // Noop function

  get counterValue() {
    return this._counterValue;
  }

  set counterValue(val) {
    this._counterValue = val;
    this.propagateChange(val);
  }

  ngOnChanges(inputs: { counterRangeMax: any; counterRangeMin: any; }) {
    if (inputs.counterRangeMax || inputs.counterRangeMin) {
      this.validateFn = counterRangeValidator(this.counterRangeMin, this.counterRangeMax);
    }
  }

  writeValue(value: number) {
    if (value) {
      this.counterValue = value;
    }
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched() { }

  increase() {
    this.counterValue++;
  }

  decrease() {
    this.counterValue--;
  }

  validate(c: FormControl) {
    return this.validateFn(c);
  }
}
