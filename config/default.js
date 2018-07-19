module.exports = {
  port: process.argv[3]||3200,
  rpcPort:process.argv[4]||8546,
  nodeRpc:process.argv[5]||"http://127.0.0.1:"+(process.argv[4]||8546),
  nodeip:"127.0.0.1"
};
