import readline from "node:readline";

/**
 * A service for creating a readline interface with maskable output and providing a convenient way to ask questions.
 */
export class ReadlineService {
  private readonly rl: readline.Interface;
  private shouldMaskOutput = false;

  /**
   * Creates a new ReadlineService instance with a readline interface that can mask output.
   * @param inputStream - The input stream to use for the readline interface. Defaults to `process.stdin`.
   * @param outputStream - The output stream to use for the readline interface. Defaults to `process.stdout`.
   */
  constructor(
    inputStream: NodeJS.ReadableStream = process.stdin,
    outputStream: NodeJS.WritableStream = process.stdout
  ) {
    this.rl = this.createReadlineInterfaceWithMaskableOutput(
      inputStream,
      outputStream
    );
  }

  /**
   * Creates a readline interface with maskable output.
   * @param inputStream - The input stream to use for the readline interface. Defaults to `process.stdin`.
   * @param outputStream - The output stream to use for the readline interface. Defaults to `process.stdout`.
   * @returns A new readline interface with maskable output.
   */
  private createReadlineInterfaceWithMaskableOutput(
    inputStream: NodeJS.ReadableStream = process.stdin,
    outputStream: NodeJS.WritableStream = process.stdout
  ): readline.Interface {
    const rl = readline.createInterface({
      input: inputStream,
      output: outputStream,
    });

    inputStream.on("keypress", () => {
      if (this.shouldMaskOutput) {
        const len = rl.line.length;

        readline.moveCursor(outputStream, -len, 0, () => {
          readline.clearLine(outputStream, 1, () => {
            for (let i = 0; i < len; i++) {
              outputStream.write("*");
            }
          });
        });
      }
    });

    return rl;
  }

  /**
   * Registers a listener for the SIGINT event (usually triggered by pressing Ctrl+C).
   * When the event is triggered, the provided message (if any) is logged to the console,
   * the readline interface is closed, and the process is exited with code 0.
   * @param message - Optional message to log to the console when the SIGINT event is triggered.
   */
  public closeOnCtrlC(message?: string): void {
    this.rl.on("SIGINT", () => {
      if (message !== undefined) {
        console.log(message);
      }

      this.rl.close();
    });
  }

  public exitProcessOnClose(): void {
    this.rl.on("close", () => {
      process.exit(0);
    });
  }

  /**
   * Asks a question and returns a promise that resolves with the user's answer.
   * @param query - The question to ask the user.
   * @returns A promise that resolves with the user's answer.
   */
  public question(query: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(query, (answer) => {
        resolve(answer);
      });
    });
  }

  /**
   * Enables output masking for the readline interface.
   */
  public maskOutput(): void {
    this.shouldMaskOutput = true;
  }

  /**
   * Disables output masking for the readline interface.
   */
  public unmaskOutput(): void {
    this.shouldMaskOutput = false;
  }

  /**
   * Returns the underlying readline interface.
   * @returns The underlying readline interface.
   */
  public readlineInterface(): readline.Interface {
    return this.rl;
  }
}
