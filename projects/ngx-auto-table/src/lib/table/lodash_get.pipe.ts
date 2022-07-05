import { Pipe, PipeTransform } from "@angular/core";
import { get } from "lodash";

/**
 * Using lodash's _.get(item, 'nested.value')
 */

@Pipe({
  name: 'lodash_get',
  pure: true,
})
export class LodashGetPipe implements PipeTransform {
  transform<T>(data: T, fieldPath: string): string | number {
    return get(data, fieldPath);
  }
}