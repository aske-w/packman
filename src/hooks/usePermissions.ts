import { useCallback, useEffect, useState } from 'react';
import { getPermissions } from '../permissions/permissions';
import useLevelStore from '../store/level.store';

export const usePermissions = () => {
  const level = useLevelStore(useCallback(({ level }) => level, []));
  const [permission, setPermissions] = useState(() => getPermissions(level));

  useEffect(() => {
    setPermissions(getPermissions(level));
  }, [level]);

  return { level, permission };
};
