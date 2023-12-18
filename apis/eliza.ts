import { grpc } from "@improbable-eng/grpc-web";
import { UnaryOutput } from "@improbable-eng/grpc-web/dist/typings/unary";

import { SayRequest, SayResponse } from "~/protos/eliza_pb";
import { ElizaService } from "~/protos/eliza_pb_service";
import { ElizaServiceClient } from "~/protos/eliza_pb_service";

const HOST = "https://demo.connect.build";

export const say = (sentence: string): Promise<SayResponse> => {
  const request = new SayRequest();
  request.setSentence(sentence);

  const client = grpc.client<
    SayRequest,
    SayResponse,
    grpc.UnaryMethodDefinition<SayRequest, SayResponse>
  >(ElizaService.Say, {
    host: HOST,
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

export const sayUnary = (sentence: string): Promise<SayResponse | null> => {
  const request = new SayRequest();
  request.setSentence(sentence);

  return new Promise((resolve, reject) => {
    grpc.unary(ElizaService.Say, {
      request,
      host: HOST,
      onEnd: (res: UnaryOutput<SayResponse>) => {
        if (res.status === grpc.Code.OK) {
          resolve(res.message);
        } else {
          reject(res);
        }
      },
    });
  });
};

export const sayInvoke = (sentence: string): Promise<SayResponse> => {
  const request = new SayRequest();
  request.setSentence(sentence);

  return new Promise((resolve, reject) => {
    grpc.invoke(ElizaService.Say, {
      request,
      host: HOST,
      onMessage: (message: SayResponse) => {
        resolve(message);
      },
      onEnd: reject,
    });
  });
};

export const sayClient = (sentence: string): Promise<SayResponse | null> => {
  const client = new ElizaServiceClient(HOST);
  const request = new SayRequest();
  request.setSentence(sentence);
  const metadata = new grpc.Metadata();

  return new Promise((resolve, reject) => {
    client.say(request, metadata, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};
