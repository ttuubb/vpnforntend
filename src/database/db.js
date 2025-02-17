import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({ name: 'nodes.db' });

const initDB = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS nodes ' +
        '(id TEXT PRIMARY KEY, name TEXT, address TEXT, port INTEGER, protocol TEXT, latency INTEGER);',
        [],
        () => resolve(),
        (tx, error) => reject(error)
      );
    });
  });
};

const saveNodes = (nodes) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      nodes.forEach(node => {
        tx.executeSql(
          'INSERT OR REPLACE INTO nodes VALUES (?, ?, ?, ?, ?, ?)',
          [node.id, node.name, node.address, node.port, node.protocol, node.latency],
          () => {},
          (tx, error) => reject(error)
        );
      });
    }, (error) => reject(error), () => resolve());
  });
};