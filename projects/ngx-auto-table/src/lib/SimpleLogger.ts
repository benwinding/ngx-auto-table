export class SimpleLogger {
  constructor(private debug: boolean, private prefix: string) {}

  public get log() {
    if (!this.debug) {
      return (...any) => {};
    }
    const boundLogFn: (...any) => void = console.log.bind(
      console,
      '> ngx-auto-table ' + this.prefix + ' ' 
    );
    return boundLogFn;
  }

  public get warn() {
    if (!this.debug) {
      return (...any) => {};
    }
    const boundLogFn: (...any) => void = console.warn.bind(
      console,
      '> ngx-auto-table ' + this.prefix + ' '
    );
    return boundLogFn;
  }

  public get error() {
    if (!this.debug) {
      return (...any) => {};
    }
    const boundLogFn: (...any) => void = console.error.bind(
      console,
      '> ngx-auto-table ' + this.prefix + ' '
    );
    return boundLogFn;
  }
}
