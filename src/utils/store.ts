import { Store } from 'tauri-plugin-store-api';

const store = new Store('.settings.dat');

export const getSongDirectory = async (): Promise<string> => (await store.get('songDirectory')) as string;

export const saveSongDirectory = async (directory: string) => {
  console.log('Saving song directory', directory);
  await store.set('songDirectory', directory);
};

export default store;
