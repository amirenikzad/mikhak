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
import { FormData2 } from './FormData2.jsx';
import { giveText } from '../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { fetchWithAxios } from '../../../../Base/axios/FetchAxios.jsx';
import { setIsFetchingRole } from '../../../../../store/features/isLoadingSlice.jsx';
import { POST_EDITION, PUT_EDITION } from '../../../../Base/UserAccessNames.jsx';

export default function AddEditEdition({ onCloseModal, edition = {}, editing }) {
  const accessSlice = useSelector(state => state.accessSlice);
  const isLoadingSlice = useSelector(state => state.isLoadingSlice);
  const [editionForm, setEditionForm] = useState({
    edition_name: { value: editing ? edition.edition_name : '', isInvalid: false },
  });
  const dispatch = useDispatch();
  const buttonId = useMemo(() => 'edition_submit_id', []);

  const addEditionAxios = () => {
    if (!accessSlice.isAdmin && !accessSlice.userAccess?.includes(POST_EDITION)) {
      showToast({
        title: giveText(30),
        description: giveText(97),
        status: 2,
      });

    } else if (editionForm.edition_name.value === '') {
      showToast({
        title: giveText(30),
        description: giveText(26),
        status: 2,
      });
      handleErrors(editionForm, setEditionForm, ['edition_name']);

    } else {
      const toastId = promiseToast();
      dispatch(setIsFetchingRole(true));

      fetchWithAxios.post(`/edition?edition_name=${editionForm.edition_name.value}`, {})
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

  const editEditionAxios = () => {
    if (!accessSlice.isAdmin && !accessSlice.userAccess?.includes(PUT_EDITION)) {
      showToast({
        title: giveText(30),
        description: giveText(97),
        status: 2,
      });

    } else if (editionForm.edition_name.value === '') {
      showToast({
        title: giveText(30),
        description: giveText(26),
        status: 2,
      });
      handleErrors(editionForm, setEditionForm, ['edition_name']);

    } else {
      const toastId = promiseToast();
      dispatch(setIsFetchingRole(true));

      fetchWithAxios.put(`/edition?name=${editionForm.edition_name.value}&edition_id=${edition.id}`, {})
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
    setEditionForm((prev) => ({ ...prev, [name]: { ...prev[name], value, isInvalid: false } }));
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ height: 'inherit' }}>
      <Base buttonId={buttonId}
            submitTitle={giveText(17)}
            title={editing ? giveText(444) : giveText(445)}
            submitFunc={editing ? editEditionAxios : addEditionAxios}
            onCloseModal={onCloseModal}
            isLoadingSubmitButton={isLoadingSlice.isFetchingEdition}
            hasSubmitButton={true}
            hasCancelButton={false}
            w={'100%'}
            px={0}
            ml={0}
            mr={0}
            Content={<FormData2 changeInputs={changeInputs} buttonId={buttonId} registerForm={editionForm} />} />
    </motion.div>
  );
};
