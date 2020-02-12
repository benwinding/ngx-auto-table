import { ColumnDefinition } from "./models";
import { KeyValue } from "@angular/common";

export interface ColumnDefinitionInternal extends ColumnDefinition {
  field: string;
  header_pretty: string;
}

export type HeaderKeyList = KeyValue<string, string>[];
