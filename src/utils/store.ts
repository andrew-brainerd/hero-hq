import { Store } from 'tauri-plugin-store-api';

const store = new Store('.settings.dat');

export const saveSongDirectory = async (directory: string) => {
  await store.set('songDirectory', directory);
};

export default store;
