import { http, HttpResponse } from "msw";

import { encodeProtobuf } from "./grpc";
import { SayResponse } from "~/protos/eliza_pb";

const BASE_URL = "https://demo.connect.build";

export const handlers = [
  http.post(`${BASE_URL}/buf.connect.demo.eliza.v1.ElizaService/Say`, () => {
    const sayRes = new SayResponse();
    sayRes.setSentence("Hello world");

    const response = encodeProtobuf(sayRes.serializeBinary());

    return HttpResponse.arrayBuffer(response, {
      headers: {
        "content-type": "application/grpc-web+proto",
      },
    });
  }),
];
