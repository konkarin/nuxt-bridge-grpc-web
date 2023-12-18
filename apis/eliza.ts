import { grpc } from "@improbable-eng/grpc-web";

import { SayRequest, SayResponse } from "~/protos/eliza_pb";
import { ElizaService } from "~/protos/eliza_pb_service";

export const say = (sentence: string): Promise<SayResponse> => {
  const request = new SayRequest();
  request.setSentence(sentence);

  const client = grpc.client<
    SayRequest,
    SayResponse,
    grpc.UnaryMethodDefinition<SayRequest, SayResponse>
  >(ElizaService.Say, {
    host: "https://demo.connect.build/",
  });
  client.start();
  client.send(request);

  return new Promise((resolve, reject) => {
    client.onMessage(resolve);
    client.onEnd((code, message, trailers) => {
      reject({ code, message, trailers });
    });
  });
};
