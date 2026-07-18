import { aboutApi, type AboutData } from '@/lib/api-services';

export type { AboutData };

export async function getAboutData() {
  return aboutApi.get();
}
