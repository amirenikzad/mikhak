import { useCallback, useMemo, useState } from 'react';
import {
  showToast,
  checkStatus,
  handleErrors,
  promiseToast,
  updatePromiseToastError,
  updatePromiseToastSuccessWarningInfo,
} from '../../../../Base/BaseFunction.jsx';
import { motion } from 'motion/react';
import { Base } from '../../../../Authentication/Base.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { FormData } from './FormData.jsx';
import { giveText } from '../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { fetchWithAxios } from '../../../../Base/axios/FetchAxios.jsx';
import { setIsFetchingRole } from '../../../../../store/features/isLoadingSlice.jsx';
import { POST_PLATFORM, PUT_PLATFORM } from '../../../../Base/UserAccessNames.jsx';

export default function AddEditPlatform({ onCloseModal, platform = {}, editing }) {
  const accessSlice = useSelector(state => state.accessSlice);
  const isLoadingSlice = useSelector(state => state.isLoadingSlice);
  const [platformForm, setPlatformForm] = useState({
    platform_name: { value: editing ? platform.platform_name : '', isInvalid: false },
  });
  const dispatch = useDispatch();
  const buttonId = useMemo(() => 'platform_submit_id', []);

  const addPlatformAxios = () => {
    if (!accessSlice.isAdmin && !accessSlice.userAccess?.includes(POST_PLATFORM)) {
      showToast({
        title: giveText(30),
        description: giveText(97),
        status: 2,
      });

    } else if (platformForm.platform_name.value === '') {
      showToast({
        title: giveText(30),
        description: giveText(26),
        status: 2,
      });
      handleErrors(platformForm, setPlatformForm, ['platform_name']);

    } else {
      const toastId = promiseToast();
      dispatch(setIsFetchingRole(true));

      fetchWithAxios.post(`/platform?platform_name=${platformForm.platform_name.value}`, {})
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

  const editPlatformAxios = () => {
    if (!accessSlice.isAdmin && !accessSlice.userAccess?.includes(PUT_PLATFORM)) {
      showToast({
        title: giveText(30),
        description: giveText(97),
        status: 2,
      });

    } else if (platformForm.platform_name.value === '') {
      showToast({
        title: giveText(30),
        description: giveText(26),
        status: 2,
      });
      handleErrors(platformForm, setPlatformForm, ['platform_name']);

    } else {
      const toastId = promiseToast();
      dispatch(setIsFetchingRole(true));

      fetchWithAxios.put(`/platform?platform_name=${platformForm.platform_name.value}&platform_id=${platform.id}`, {})
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
    setPlatformForm((prev) => ({ ...prev, [name]: { ...prev[name], value, isInvalid: false } }));
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ height: 'inherit' }}>
      <Base buttonId={buttonId}
            submitTitle={giveText(17)}
            title={editing ? giveText(434) : giveText(432)}
            submitFunc={editing ? editPlatformAxios : addPlatformAxios}
            onCloseModal={onCloseModal}
            isLoadingSubmitButton={isLoadingSlice.isFetchingPlatform}
            hasSubmitButton={true}
            hasCancelButton={false}
            w={'100%'}
            px={0}
            ml={0}
            mr={0}
            Content={<FormData changeInputs={changeInputs} buttonId={buttonId} registerForm={platformForm} />} />
    </motion.div>
  );
};
