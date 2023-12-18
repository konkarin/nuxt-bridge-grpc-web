/**
 * @see https://zenn.dev/link/comments/ee89092f84b746
 * @see https://github.com/grpc/grpc-web/issues/634#issuecomment-1052189381
 * @see https://lucas-levin.com/code/blog/mocking-grpc-web-requests-for-integration-testing
 */
export const encodeProtobuf = (replyBuffer: Uint8Array) => {
  const replyLength = toBytesInt32(replyBuffer.length);

  const headers = Buffer.from([
    ...createHeader('grpc-status', '0'),
    ...createHeader('grpc-message', 'OK'),
  ]);
  const headersLength = toBytesInt32(headers.length);

  const response = Buffer.from([
    0, // mark response start ("data" frame coming next)
    ...replyLength,
    ...replyBuffer,
    128, // end of "data" frame, trailer frame coming next
    ...headersLength,
    ...headers,
  ]);

  return response;
};

const toBytesInt32 = (num: number): Uint8Array => {
  // an Int32 takes 4 bytes
  const arr = new ArrayBuffer(4);
  const view = new DataView(arr);
  // byteOffset = 0; litteEndian = false
  view.setUint32(0, num, false);
  return new Uint8Array(arr);
};

const createHeader = (name: string, value: string): Buffer => {
  const buffers: Array<number> = [];
  for (const char of name) {
    buffers.push(char.charCodeAt(0));
  }
  buffers.push(':'.charCodeAt(0));
  for (const char of value) {
    buffers.push(char.charCodeAt(0));
  }
  buffers.push('\r'.charCodeAt(0));
  buffers.push('\n'.charCodeAt(0));
  return Buffer.from(buffers);
};
