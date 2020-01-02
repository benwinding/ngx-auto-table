export class SimpleLogger {
  constructor(private debug: boolean) {}

  public get log() {
    if (!this.debug) {
      return (...any) => {};
    }
    const boundLogFn: (...any) => void = console.log.bind(
      console,
      'ngx-auto-table:: '
    );
    return boundLogFn;
  }

  public get warn() {
    if (!this.debug) {
      return (...any) => {};
    }
    const boundLogFn: (...any) => void = console.warn.bind(
      console,
      'ngx-auto-table:: '
    );
    return boundLogFn;
  }
}
