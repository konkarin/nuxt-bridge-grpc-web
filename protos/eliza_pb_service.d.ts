// package: buf.connect.demo.eliza.v1
// file: eliza.proto

import * as eliza_pb from "./eliza_pb";
import {grpc} from "@improbable-eng/grpc-web";

type ElizaServiceSay = {
  readonly methodName: string;
  readonly service: typeof ElizaService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof eliza_pb.SayRequest;
  readonly responseType: typeof eliza_pb.SayResponse;
};

type ElizaServiceConverse = {
  readonly methodName: string;
  readonly service: typeof ElizaService;
  readonly requestStream: true;
  readonly responseStream: true;
  readonly requestType: typeof eliza_pb.ConverseRequest;
  readonly responseType: typeof eliza_pb.ConverseResponse;
};

type ElizaServiceIntroduce = {
  readonly methodName: string;
  readonly service: typeof ElizaService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof eliza_pb.IntroduceRequest;
  readonly responseType: typeof eliza_pb.IntroduceResponse;
};

export class ElizaService {
  static readonly serviceName: string;
  static readonly Say: ElizaServiceSay;
  static readonly Converse: ElizaServiceConverse;
  static readonly Introduce: ElizaServiceIntroduce;
}

export type ServiceError = { message: string, code: number; metadata: grpc.Metadata }
export type Status = { details: string, code: number; metadata: grpc.Metadata }

interface UnaryResponse {
  cancel(): void;
}
interface ResponseStream<T> {
  cancel(): void;
  on(type: 'data', handler: (message: T) => void): ResponseStream<T>;
  on(type: 'end', handler: (status?: Status) => void): ResponseStream<T>;
  on(type: 'status', handler: (status: Status) => void): ResponseStream<T>;
}
interface RequestStream<T> {
  write(message: T): RequestStream<T>;
  end(): void;
  cancel(): void;
  on(type: 'end', handler: (status?: Status) => void): RequestStream<T>;
  on(type: 'status', handler: (status: Status) => void): RequestStream<T>;
}
interface BidirectionalStream<ReqT, ResT> {
  write(message: ReqT): BidirectionalStream<ReqT, ResT>;
  end(): void;
  cancel(): void;
  on(type: 'data', handler: (message: ResT) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'end', handler: (status?: Status) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'status', handler: (status: Status) => void): BidirectionalStream<ReqT, ResT>;
}

export class ElizaServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  say(
    requestMessage: eliza_pb.SayRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: eliza_pb.SayResponse|null) => void
  ): UnaryResponse;
  say(
    requestMessage: eliza_pb.SayRequest,
    callback: (error: ServiceError|null, responseMessage: eliza_pb.SayResponse|null) => void
  ): UnaryResponse;
  converse(metadata?: grpc.Metadata): BidirectionalStream<eliza_pb.ConverseRequest, eliza_pb.ConverseResponse>;
  introduce(requestMessage: eliza_pb.IntroduceRequest, metadata?: grpc.Metadata): ResponseStream<eliza_pb.IntroduceResponse>;
}

