import { decode } from 'base64-js';
import axios from 'axios';

const parseV2rayNSubscription = async (url) => {
  try {
    const response = await axios.get(url);
    const decodedData = decode(response.data).toString('utf-8');
    return JSON.parse(decodedData).map(node => ({
      name: node.ps,
      address: node.add,
      port: node.port,
      protocol: node.net,
      latency: -1, // 添加 latency 属性，初始值为 -1
      id: node.id
    }));
  } catch (error) {
    throw new Error('订阅解析失败');
  }
};

export default parseV2rayNSubscription;