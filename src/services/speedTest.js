import axios from 'axios';
import parseV2rayNSubscription from '../utils/subscriptionParser'; // 修改导入路径

const testNodeLatency = async (node) => {
  const startTime = Date.now();
  try {
    await axios.head(`https://${node.address}:${node.port}`, {
      timeout: 5000
    });
    return Date.now() - startTime;
  } catch (error) {
    return -1;
  }
};

const batchSpeedTest = async (url) => {
  const nodes = await parseV2rayNSubscription(url); // 使用 parseV2rayNSubscription 获取节点列表
  return Promise.all(nodes.map(async (node) => {
    return { ...node, latency: await testNodeLatency(node) };
  }));
};

export { batchSpeedTest };