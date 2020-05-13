const fs = require('fs');
const { random } = require('faker');
const { DgraphClient: NativeClient, Mutation: NativeMutation } = require('dgraph-js-native');
const { DgraphClient: JsClient, DgraphClientStub, Mutation: JsMutation, Operation } = require('dgraph-js');
const grpc = require('grpc');

function getJsClient() {
  const stub = new DgraphClientStub('localhost:9080', grpc.credentials.createInsecure(), {
    'grpc.max_receive_message_length': -1, // unlimited
    'grpc.max_send_message_length': -1, // unlimited
  });
  return new JsClient(stub);
}

function getNativeClient() {
  return new NativeClient(['http://localhost:9080']);
}

async function clearTest() {
  const client = getJsClient();
  const op = new Operation();
  op.setDropAll(true);
  return client.alter(op);
}

async function stressTest(client, Mutation, batches, nodesPerBatch, predsSize) {
  const txn = client.newTxn();

  const preds = [];
  for (let j = 0; j < predsSize; j++) {
    preds.push(random.alphaNumeric(10));
  }

  for (let batch = 0; batch < batches; batch++) {
    let nquads = '';

    for (let i = 0; i < nodesPerBatch; i++) {
      const nodeId = random.alphaNumeric(10);
      nquads += `_:${nodeId} <dgraph.type> "Node" .\n`;
      for (let j = 0; j < predsSize; j++) {
        nquads += `_:${nodeId} <${preds[j]}> "${random.alphaNumeric(20)}" .\n`;
      }
    }

    // console.log(nquads, '\n\n');

    const mutation = new Mutation();
    mutation.setSetNquads(nquads);
    const result = await txn.mutate(mutation);
    // console.log(result.getUidsMap());
    console.log('batch', batch);
  }

  await txn.commit();
  console.log('done');
}

async function nativeBenchmark() {
  const out = fs.createWriteStream('native_benchmark_results.csv');
  out.write('batches,nodesPerBatch,predsSize,timeSpent\n');

  const batchesList = [10, 50, 100];
  const nodesPerBatchList = [10, 100, 1000, 10000];
  const predsSizeList = [1, 10, 100];

  for (let i = 0; i < batchesList.length; i++) {
    const batches = batchesList[i];
    for (let j = 0; j < nodesPerBatchList.length; j++) {
      const nodesPerBatch = nodesPerBatchList[j];
      for (let k = 0; k < predsSizeList.length; k++) {
        const predsSize = predsSizeList[k];

        await clearTest();
        console.log(
          'testing native client with batches =', batches,
          'nodes per batch =', nodesPerBatch,
          'predicate count =', predsSize,
        );
        const timeStart = Date.now();
        await stressTest(getNativeClient(), NativeMutation, batches, nodesPerBatch, predsSize);
        const timeEnd = Date.now();
        console.log('time spent:', timeEnd - timeStart);

        out.write(`${batches},${nodesPerBatch},${predsSize},${timeEnd - timeStart}\n`);
      }
    }
  }

  out.close();

  // await clearTest();
  // console.log('testing js client');
  // console.time('test js client');
  // await stressTest(getJsClient(), JsMutation);
  // console.timeEnd('test js client');
}

nativeBenchmark();