import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'temp',
  standalone: true,
})
export class CustomPipe implements PipeTransform {
  transform(
    value: string,
    transformTo: 'upper' | 'lower' | 'trim',
    length?: number
  ) {
    let output = value;
    switch (transformTo) {
      case 'upper':
        output = output.toUpperCase();
        break;
      case 'lower':
        output = output.toLowerCase();
        break;
      case 'trim':
        output = output.trim();
        break;
      default:
        break;
    }
    return output.substring(0, length);
  }
}
