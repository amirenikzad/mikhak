import { useCallback, useMemo, useState } from 'react';
import {
  showToast,
  checkStatus,
  handleErrors,
  promiseToast,
  updatePromiseToastError,
  updatePromiseToastSuccessWarningInfo,
} from '../../../../../Base/BaseFunction.jsx';
import { motion } from 'motion/react';
import { Base } from '../../../../../Authentication/Base.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { FormData } from './FormData.jsx';
import { giveText } from '../../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { fetchWithAxios } from '../../../../../Base/axios/FetchAxios.jsx';
import { setIsFetchingRole } from '../../../../../../store/features/isLoadingSlice.jsx';
import { POST_ROLE, PUT_ROLE } from '../../../../../Base/UserAccessNames.jsx';

export default function AddEditRole({ onCloseModal, role = {}, editing }) {
  const accessSlice = useSelector(state => state.accessSlice);
  const isLoadingSlice = useSelector(state => state.isLoadingSlice);
  const [roleForm, setRoleForm] = useState({
    role_name: { value: editing ? role.role_name : '', isInvalid: false },
  });
  const dispatch = useDispatch();
  const buttonId = useMemo(() => 'role_submit_id', []);

  const addRoleAxios = () => {
    if (!accessSlice.isAdmin && !accessSlice.userAccess?.includes(POST_ROLE)) {
      showToast({
        title: giveText(30),
        description: giveText(97),
        status: 2,
      });

    } else if (roleForm.role_name.value === '') {
      showToast({
        title: giveText(30),
        description: giveText(26),
        status: 2,
      });
      handleErrors(roleForm, setRoleForm, ['role_name']);

    } else {
      const toastId = promiseToast();
      dispatch(setIsFetchingRole(true));

      fetchWithAxios.post(`/role?role_name=${roleForm.role_name.value}`, {})
        .then((response) => {
          if (checkStatus({ status: response.data.status })) {
            onCloseModal();
          }
          updatePromiseToastSuccessWarningInfo({ toastId, response });

        })
        .catch((error) => {
          updatePromiseToastError({ toastId, error });
        })
        .finally(() => {
          dispatch(setIsFetchingRole(false));
        });
    }
  };

  const editRoleAxios = () => {
    if (!accessSlice.isAdmin && !accessSlice.userAccess?.includes(PUT_ROLE)) {
      showToast({
        title: giveText(30),
        description: giveText(97),
        status: 2,
      });

    } else if (roleForm.role_name.value === '') {
      showToast({
        title: giveText(30),
        description: giveText(26),
        status: 2,
      });
      handleErrors(roleForm, setRoleForm, ['role_name']);

    } else {
      const toastId = promiseToast();
      dispatch(setIsFetchingRole(true));

      fetchWithAxios.put(`/role?role_name=${roleForm.role_name.value}&role_id=${role.id}`, {})
        .then((response) => {
          onCloseModal();
          updatePromiseToastSuccessWarningInfo({ toastId, response });

        })
        .catch((error) => {
          updatePromiseToastError({ toastId, error });
        })
        .finally(() => {
          dispatch(setIsFetchingRole(false));
        });
    }
  };

  const changeInputs = useCallback((event) => {
    const { name, value } = event.target;
    setRoleForm((prev) => ({ ...prev, [name]: { ...prev[name], value, isInvalid: false } }));
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ height: 'inherit' }}>
      <Base buttonId={buttonId}
            submitTitle={giveText(17)}
            title={editing ? giveText(84) : giveText(42)}
            submitFunc={editing ? editRoleAxios : addRoleAxios}
            onCloseModal={onCloseModal}
            isLoadingSubmitButton={isLoadingSlice.isFetchingRole}
            hasSubmitButton={true}
            hasCancelButton={false}
            w={'100%'}
            px={0}
            ml={0}
            mr={0}
            Content={<FormData changeInputs={changeInputs} buttonId={buttonId} registerForm={roleForm} />} />
    </motion.div>
  );
};
