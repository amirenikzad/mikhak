import { createListCollection, Stack } from '@chakra-ui/react';
import { useCallback, useMemo, useState } from 'react';
import {
  showToast,
  handleErrors,
  promiseToast,
  updatePromiseToastError,
  checkStatus,
  updatePromiseToastSuccessWarningInfo,
} from '../../../../../Base/BaseFunction.jsx';
import { motion } from 'motion/react';
import { Base } from '../../../../../Authentication/Base.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { giveText } from '../../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { FormData } from './FormData.jsx';
import { fetchWithAxios } from '../../../../../Base/axios/FetchAxios.jsx';
import { setIsFetchingPermission } from '../../../../../../store/features/isLoadingSlice.jsx';
import { POST_PERMISSIONS } from '../../../../../Base/UserAccessNames.jsx';

export default function AddEditPermission({
                                            onCloseModal,
                                            formField = {} || '',
                                            editPermissionAxios,
                                            editing = false,
                                          }) {
  const accessSlice = useSelector(state => state.accessSlice);
  const isLoadingSlice = useSelector(state => state.isLoadingSlice);
  const dispatch = useDispatch();
  const [permissionForm, setPermissionForm] = useState({
    id: formField?.id,
    action: { value: editing ? formField?.action.value : '', isInvalid: false },
    method: { value: editing ? [formField?.method.value] : [], isInvalid: false },
    path: { value: editing ? formField?.path.value : '', isInvalid: false },
    description: { value: editing ? formField?.description.value : '', isInvalid: false },
    is_default: { value: editing ? formField?.is_default.value : false, isInvalid: false },
  });
  const options = createListCollection({
    items: [
      { value: 'post', label: 'POST' },
      { value: 'get', label: 'GET' },
      { value: 'put', label: 'PUT' },
      { value: 'delete', label: 'DELETE' },
      { value: 'patch', label: 'PATCH' },
    ],
  });
  const buttonId = useMemo(() => 'permission_submit_id', []);

  const addPermissionAxios = () => {
    if (!accessSlice.isAdmin && !accessSlice.userAccess?.includes(POST_PERMISSIONS)) {
      showToast({
        title: giveText(30),
        description: giveText(97),
        status: 2,
      });

    } else if (permissionForm.action.value === '' || permissionForm.method.value === [] || permissionForm.path.value === '') {
      showToast({
        title: giveText(30),
        description: giveText(26),
        status: 2,
      });
      handleErrors(permissionForm, setPermissionForm, ['action', 'method', 'path']);

    } else {
      const toastId = promiseToast();
      dispatch(setIsFetchingPermission(true));

      fetchWithAxios.post(`/permission?action=${permissionForm.action.value}&method=${permissionForm.method.value[0]}&path=${permissionForm.path.value}&is_default=${permissionForm.is_default.value}&description=${permissionForm.description.value}`,
        {}).then((response) => {
        if (checkStatus({ status: response.data.status })) {
          onCloseModal();
        }
        updatePromiseToastSuccessWarningInfo({ toastId, response });

      }).catch((error) => {
        updatePromiseToastError({ toastId, error });
      }).finally(() => {
        dispatch(setIsFetchingPermission(false));
      });
    }
  };

  const changeInputs = useCallback((event) => {
    const { name, value } = event.target;
    setPermissionForm((prev) => ({
      ...prev, [name]: {
        ...prev[name],
        value,
        isInvalid: false,
      },
    }));
  }, []);

  const changeSwitch = (event) => {
    const { name, checked } = event.target;
    setPermissionForm((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        value: checked,
        isInvalid: false,
      },
    }));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ height: 'inherit' }}>
      <Base buttonId={buttonId}
            submitTitle={giveText(17)}
            title={editing ? giveText(85) : giveText(34)}
            submitFunc={editing ? () => editPermissionAxios({
              permissionForm: permissionForm,
              onCloseModal: onCloseModal,
              index: permissionForm.id,
              setPermissionForm,
            }) : addPermissionAxios}
            hasCancelButton={false}
            onCloseModal={onCloseModal}
            px={0}
            backNone={true}
            isLoadingSubmitButton={isLoadingSlice.isFetchingPermission}
            mr={0}
            ml={0}
            box_shadow={false}
            w={'100%'}
            Content={(
              <Stack spacing={2}>
                <FormData permissionForm={permissionForm}
                          buttonId={buttonId}
                          setPermissionForm={setPermissionForm}
                          changeInputs={changeInputs}
                          changeSwitch={changeSwitch}
                          options={options} />
              </Stack>
            )} />
    </motion.div>
  );
};
