// package: buf.connect.demo.eliza.v1
// file: eliza.proto

var eliza_pb = require("./eliza_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var ElizaService = (function () {
  function ElizaService() {}
  ElizaService.serviceName = "buf.connect.demo.eliza.v1.ElizaService";
  return ElizaService;
}());

ElizaService.Say = {
  methodName: "Say",
  service: ElizaService,
  requestStream: false,
  responseStream: false,
  requestType: eliza_pb.SayRequest,
  responseType: eliza_pb.SayResponse
};

ElizaService.Converse = {
  methodName: "Converse",
  service: ElizaService,
  requestStream: true,
  responseStream: true,
  requestType: eliza_pb.ConverseRequest,
  responseType: eliza_pb.ConverseResponse
};

ElizaService.Introduce = {
  methodName: "Introduce",
  service: ElizaService,
  requestStream: false,
  responseStream: true,
  requestType: eliza_pb.IntroduceRequest,
  responseType: eliza_pb.IntroduceResponse
};

exports.ElizaService = ElizaService;

function ElizaServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

ElizaServiceClient.prototype.say = function say(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ElizaService.Say, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

ElizaServiceClient.prototype.converse = function converse(metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.client(ElizaService.Converse, {
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport
  });
  client.onEnd(function (status, statusMessage, trailers) {
    listeners.status.forEach(function (handler) {
      handler({ code: status, details: statusMessage, metadata: trailers });
    });
    listeners.end.forEach(function (handler) {
      handler({ code: status, details: statusMessage, metadata: trailers });
    });
    listeners = null;
  });
  client.onMessage(function (message) {
    listeners.data.forEach(function (handler) {
      handler(message);
    })
  });
  client.start(metadata);
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    write: function (requestMessage) {
      client.send(requestMessage);
      return this;
    },
    end: function () {
      client.finishSend();
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

ElizaServiceClient.prototype.introduce = function introduce(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(ElizaService.Introduce, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onMessage: function (responseMessage) {
      listeners.data.forEach(function (handler) {
        handler(responseMessage);
      });
    },
    onEnd: function (status, statusMessage, trailers) {
      listeners.status.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners.end.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners = null;
    }
  });
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

exports.ElizaServiceClient = ElizaServiceClient;

