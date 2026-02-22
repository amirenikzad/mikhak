import { useCallback, useMemo, useState } from 'react';

export const useCheckboxTable = ({ listValue, listId = 'id' }) => {
  const [ids, setIds] = useState(new Set());
  const isAnyChecked = useMemo(() => ids.size > 0 && ids.size < listValue.length, [ids, listValue]);
  const isAllChecked = useMemo(() => ids.size > 0 && ids.size === listValue.length, [ids, listValue]);

  const onChangeCheckboxAll = useCallback((list) => {
    if (isAllChecked) {
      setIds(new Set());
    } else {
      const allIds = new Set(list.map((value) => value[listId]));
      setIds(allIds);
    }
  }, [isAllChecked, listId]);

  const onChangeCheckbox = useCallback((rowId) => {
    setIds((prev) => {
        const next = new Set(prev);
        next.has(rowId) ? next.delete(rowId) : next.add(rowId);
        return next;
      },
    );
  }, []);

  const onDeleteRow = useCallback((list) => {
    setIds((prev) => {
      const next = new Set(prev);
      list.forEach((id) => next.delete(id));
      return next;
    });
  }, []);

  return {
    ids,
    isAnyChecked,
    isAllChecked,
    onChangeCheckboxAll,
    onChangeCheckbox,
    onDeleteRow,
  };
};
