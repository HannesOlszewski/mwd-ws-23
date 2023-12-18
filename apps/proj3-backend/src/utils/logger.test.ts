import { Logger } from "./logger";

describe("Logger", () => {
  let logger: Logger;

  beforeEach(() => {
    logger = new Logger("TEST");
  });

  it("should log a message with the 'log' log level", () => {
    const consoleLogSpy = jest.spyOn(console, "log");
    const message = "Test log message";

    logger.log(message);
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining("[TEST]"),
    );

    logger.log(message);
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining("|LOG  |"),
    );

    logger.log(message);
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining(message),
    );
  });

  it("should log a message with the 'info' log level", () => {
    const consoleInfoSpy = jest.spyOn(console, "info");
    const message = "Test info message";

    logger.info(message);
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      expect.stringContaining("[TEST]"),
    );

    logger.info(message);
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      expect.stringContaining("|INFO |"),
    );

    logger.info(message);
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      expect.stringContaining(message),
    );
  });

  it("should log a message with the 'debug' log level", () => {
    const consoleDebugSpy = jest.spyOn(console, "debug");
    const message = "Test debug message";

    logger.debug(message);
    expect(consoleDebugSpy).toHaveBeenCalledWith(
      expect.stringContaining("[TEST]"),
    );

    logger.debug(message);
    expect(consoleDebugSpy).toHaveBeenCalledWith(
      expect.stringContaining("|DEBUG|"),
    );

    logger.debug(message);
    expect(consoleDebugSpy).toHaveBeenCalledWith(
      expect.stringContaining(message),
    );
  });

  it("should log a message with the 'error' log level", () => {
    const consoleErrorSpy = jest.spyOn(console, "error");
    const message = "Test error message";

    logger.error(message);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining("[TEST]"),
    );

    logger.error(message);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining("|ERROR|"),
    );

    logger.error(message);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining(message),
    );
  });

  it("should log a message with the 'warn' log level", () => {
    const consoleWarnSpy = jest.spyOn(console, "warn");
    const message = "Test warn message";

    logger.warn(message);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining("[TEST]"),
    );

    logger.warn(message);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining("|WARN |"),
    );

    logger.warn(message);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining(message),
    );
  });
});
