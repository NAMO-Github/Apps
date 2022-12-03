import WalletConnect from '@walletconnect/client';
import { IJsonRpcRequest } from '@walletconnect/types';
import Web3 from 'web3';
import { AbstractProvider } from 'web3-core';
import { JsonRpcPayload, JsonRpcResponse } from 'web3-core-helpers';
import environment from 'react-native-config';

const walletConnectMethod = ['eth_sendTransaction', 'eth_sendRawTransaction'];

const httpProvider = new Web3.providers.HttpProvider(environment.rpcUrl);

export function getWeb3Instance({
  connector,
  useHttpProvider,
}: {
  connector: WalletConnect;
  useHttpProvider?: boolean;
}) {
  const makeJsonRpcResponse = (
    payload: JsonRpcPayload,
    result: unknown,
    error?: Error
  ): JsonRpcResponse => ({
    id: +payload.id,
    jsonrpc: payload.jsonrpc,
    result,
    error: error,
  });

  const abstractProvider: AbstractProvider = {
    sendAsync: async (payload, callback) => {
      console.log(payload);
      if (walletConnectMethod.includes(payload.method) && !useHttpProvider) {
        connector
          .sendCustomRequest(payload as Partial<IJsonRpcRequest>)
          .then((result) =>
            callback(null, makeJsonRpcResponse(payload, result))
          )
          .catch((error) =>
            callback(error, makeJsonRpcResponse(payload, null, error))
          );
      } else {
        await new Promise((resolve) => {
          setTimeout(resolve, 2000);
        });
        return httpProvider.send(payload, callback);
      }
    },
    send: async (payload, callback) => {
      if (walletConnectMethod.includes(payload.method) && !useHttpProvider) {
        connector
          .sendCustomRequest(payload as Partial<IJsonRpcRequest>)
          .then((result) =>
            callback(null, makeJsonRpcResponse(payload, result))
          )
          .catch((error) =>
            callback(error, makeJsonRpcResponse(payload, null, error))
          );
      } else {
        await new Promise((resolve) => {
          setTimeout(resolve, 2000);
        });
        return httpProvider.send(payload, callback);
      }
    },
    connected: connector.connected,
  };

  return new Web3(abstractProvider);
}
