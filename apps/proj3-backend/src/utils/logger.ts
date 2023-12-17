/**
 * Logger class for logging messages with different log levels.
 */
export class Logger {
  private readonly prefix: string;

  /**
   * Constructs a new Logger instance with the specified prefix.
   *
   * @param prefix - The prefix to be added to each log message.
   */
  constructor(prefix: string) {
    this.prefix = prefix;
  }

  /**
   * Logs a message with the "log" log level.
   *
   * @param message - The message to be logged.
   */
  public log(message: string): void {
    console.log(
      `[${this.prefix}] ${new Date().toISOString()} |LOG  | ${message}`,
    );
  }

  /**
   * Logs a message with the "info" log level.
   *
   * @param message - The message to be logged.
   */
  public info(message: string): void {
    console.info(
      `[${this.prefix}] ${new Date().toISOString()} |INFO | ${message}`,
    );
  }

  /**
   * Logs a message with the "debug" log level.
   *
   * @param message - The message to be logged.
   */
  public debug(message: string): void {
    console.debug(
      `[${this.prefix}] ${new Date().toISOString()} |DEBUG| ${message}`,
    );
  }

  /**
   * Logs a message with the "error" log level.
   *
   * @param message - The message to be logged.
   */
  public error(message: string): void {
    console.error(
      `[${this.prefix}] ${new Date().toISOString()} |ERROR| ${message}`,
    );
  }

  /**
   * Logs a message with the "warn" log level.
   *
   * @param message - The message to be logged.
   */
  public warn(message: string): void {
    console.warn(
      `[${this.prefix}] ${new Date().toISOString()} |WARN | ${message}`,
    );
  }
}
