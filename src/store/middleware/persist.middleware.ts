import { configurePersist } from 'zustand-persist';
import { LOCAL_STORAGE_PREFIX } from '../../utils/utils';

const { persist, purge } = configurePersist({
  storage: localStorage,
  rootKey: LOCAL_STORAGE_PREFIX,
});

export { purge, persist };
