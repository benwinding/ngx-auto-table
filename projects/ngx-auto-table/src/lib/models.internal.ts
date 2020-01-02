import { ColumnDefinition } from "./models";

export interface ColumnDefinitionInternal extends ColumnDefinition {
  field: string;
  header_pretty: string;
}
