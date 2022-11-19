import { isPermissionGranted, sendNotification } from '@tauri-apps/api/notification';
import { invoke } from '@tauri-apps/api/tauri';
import { WRITE_TO_LOG } from '../constants/rust';

const writeToLogFile = async (message: string) => await invoke<string>(WRITE_TO_LOG, { message });

export const notify = async ({ title = '', body = '' }: { title: string; body: string }) => {
  writeToLogFile(`Notify: ${title} | ${body}`);
  const hasPermission = await isPermissionGranted();
  if (hasPermission) {
    sendNotification({ title, body });
  } else {
    writeToLogFile('Failed to send notification');
  }
};
