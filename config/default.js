module.exports = {
  port: process.argv[3] || 3200,
  rpcPort: process.argv[4] || 8546,
  nodeRpc: process.argv[5] || "http://127.0.0.1:" + (process.argv[4] || 8546),
  cicport: 'http://192.168.51.201:9000/',
  gucport:'http://52.89.199.20:9000/',
  nodeip: "127.0.0.1"
};
