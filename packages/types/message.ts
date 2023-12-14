export type ResponseMessage =
  | {
      status: "ok";
      data: unknown;
    }
  | {
      status: "error";
      message: string;
    };
