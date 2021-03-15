import { parse, stringify } from 'flatted';
import { unparse } from 'papaparse';

function RemoveWeirdJsObjects<T>(d: T): T {
  return parse(stringify(d)) as T;
}

export function downloadCSVData(
  data: any[],
  exportFunction: (d: any) => any,
  exportFilename: string
) {
  const exportFunctionSafe =
    typeof exportFunction === 'function' ? exportFunction : (a: any) => a;
  const dataSafe = RemoveWeirdJsObjects(data);
  const rowObjects = dataSafe.map((d) => exportFunctionSafe(d));
  const csvString = unparse(rowObjects);
  downloadCsvFile(csvString, exportFilename);
}

function downloadCsvFile(csvString: string, filename: string) {
  // Download it
  const link = document.createElement('a');
  link.style.display = 'none';
  link.setAttribute('target', '_blank');
  link.setAttribute(
    'href',
    'data:text/csv;charset=utf-8,' + encodeURIComponent(csvString)
  );
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
