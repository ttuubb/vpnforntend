import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native-web';
import { getSubscriptionUrls } from '../services/api';
import { insertNode, initDatabase, deleteNode } from '../database/db';
import speedTest from '../services/speedTest';

const NodeListScreen = () => {
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initializeAndFetchNodes = async () => {
      try {
        await initDatabase();
        const urls = await getSubscriptionUrls();
        const allNodes = [];
        for (const url of urls) {
          const response = await axios.get(url);
          const parsedNodes = parseV2raySubscription(response.data);
          allNodes.push(...parsedNodes);
        }
        setNodes(allNodes);
        allNodes.forEach(node => insertNode(node));
      } catch (error) {
        console.error('Error fetching and parsing nodes:', error);
      }
    };

    initializeAndFetchNodes();
  }, []);

  const handleSpeedTest = async () => {
    setLoading(true);
    const testedNodes = await Promise.all(nodes.map(async (node) => {
      const latency = await speedTest(node);
      return { ...node, latency };
    }));
    setNodes(testedNodes.sort((a, b) => a.latency - b.latency));
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Button 
        mode="contained" 
        onPress={handleSpeedTest}
        loading={loading}
      >
        一键测速排序
      </Button>
      
      <FlatList
        data={nodes}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.nodeItem}>
            <Text style={styles.nodeName}>{item.name}</Text>
            <Text style={[styles.latency, { color: getLatencyColor(item.latency) }]}>
              {item.latency > 0 ? `${item.latency}ms` : '不可用'}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const getLatencyColor = (latency) => {
  if (latency <= 100) return 'green';
  if (latency <= 300) return 'orange';
  return 'red';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  nodeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  nodeName: {
    fontSize: 16,
  },
  latency: {
    fontSize: 16,
  },
});

export default NodeListScreen;
