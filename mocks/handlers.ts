import { SayResponse } from '~/generated/protos/eliza';
import { http, HttpResponse } from 'msw';

import { encodeProtobuf } from './grpc';

const BASE_URL = 'https://demo.connect.build';

export const handlers = [
  http.post(`${BASE_URL}/buf.connect.demo.eliza.v1.ElizaService/Say`, () => {
    const sayRes = SayResponse.toBinary({ sentence: 'Hello world' });

    const response = encodeProtobuf(sayRes);

    return HttpResponse.arrayBuffer(response, {
      headers: {
        'content-type': 'application/grpc-web+proto',
      },
    });
  }),
];
