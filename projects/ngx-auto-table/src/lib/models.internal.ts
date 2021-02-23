import { ColumnDefinition } from './models';
import { KeyValue } from '@angular/common';
import { Observable } from 'rxjs';

export interface FilterOptionList {
  field: string;
  type: 'boolean' | 'string' | 'stringArray';
  options: string[]
};

export interface FieldFilterMap {
  [field: string]: FilterOptionList;
}

export interface ColumnDefinitionInternal extends ColumnDefinition {
  field: string;
  header_pretty: string;
  $string_options: Observable<string[]>;
}

export type HeaderKeyList = KeyValue<string, string>[];

export interface ColumnFilterBy {
  fieldName: string;
  bool?: boolean;
  stringArray?: string[];
}
export interface ColumnFilterByMap {
  [fieldName: string]: ColumnFilterBy;
}
