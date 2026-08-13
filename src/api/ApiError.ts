export default class ApiError extends Error {
    // message: string;
    status: number;
    code: string;
    isNetwork: boolean;
    isCancel: boolean;
  constructor({
    message = "",
    status = 0,
    code = "",
    isNetwork = false,
    isCancel = false,
  }) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.isNetwork = isNetwork;
    this.isCancel = isCancel;
  }
}