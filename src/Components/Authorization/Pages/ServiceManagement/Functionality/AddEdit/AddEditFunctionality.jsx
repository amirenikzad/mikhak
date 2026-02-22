import { useCallback, useMemo, useState } from 'react';
import {
  showToast,
  promiseToast,
  handleErrors,
  updatePromiseToastError,
  checkStatus,
  updatePromiseToastSuccessWarningInfo,
} from '../../../../../Base/BaseFunction.jsx';
import { Base } from '../../../../../Authentication/Base.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { giveText } from '../../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { FormData as FunctionalityFormData } from './FormData.jsx';
import { fetchWithAxios } from '../../../../../Base/axios/FetchAxios.jsx';
import { setIsFetchingApis } from '../../../../../../store/features/isLoadingSlice.jsx';
import { POST_FUNCTIONALITIES } from '../../../../../Base/UserAccessNames.jsx';
import { createListCollection } from '@chakra-ui/react';

export default function AddEditFunctionality({
                                               onCloseModal,
                                               formField = {} | '',
                                               editApisAxios,
                                               editing = false,
                                             }) {
  const accessSlice = useSelector(state => state.accessSlice);
  const isLoadingSlice = useSelector(state => state.isLoadingSlice);
  const dispatch = useDispatch();
  const [functionalityForm, setFunctionalityForm] = useState({
    id: formField?.id,
    name: { value: editing ? formField?.name : '', isInvalid: false },
    description: { value: editing ? formField?.description : '', isInvalid: false },
    price: { value: editing ? formField?.price : 0, isInvalid: false },
    project_id: { value: editing ? String(formField?.project_id) : 0, isInvalid: false },
    project_name: { value: editing ? formField?.project_name : '', isInvalid: false },
    api: { value: editing ? formField?.api : '', isInvalid: false },
    method: { value: editing ? formField?.method : '', isInvalid: false },
    project_light_icon: { value: editing ? formField?.project_light_icon : '', isInvalid: false },
    project_dark_icon: { value: editing ? formField?.project_dark_icon : '', isInvalid: false },
  });
  const methodOptions = createListCollection({
    items: [
      { value: 'post', label: 'POST' },
      { value: 'get', label: 'GET' },
      { value: 'put', label: 'PUT' },
      { value: 'delete', label: 'DELETE' },
      { value: 'patch', label: 'PATCH' },
    ],
  });
  const buttonId = useMemo(() => 'functionality_submit_id', []);

  const addFunctionalitiesAxios = () => {
    if (!accessSlice.isAdmin && !accessSlice.userAccess?.includes(POST_FUNCTIONALITIES)) {
      showToast({
        title: giveText(30),
        description: giveText(97),
        status: 2,
      });

    } else if (
      // functionalityForm.name.value === '' ||
      functionalityForm.project_id.value === '' ||
      functionalityForm.api.value === '' ||
      functionalityForm.method.value === '') {
      showToast({
        title: giveText(30),
        description: giveText(26),
        status: 2,
      });
      handleErrors(functionalityForm,
        setFunctionalityForm,
        [
          // 'name',
          'description',
          'project_id',
          'api',
          'method',
        ]);

    } else {
      const toastId = promiseToast();
      dispatch(setIsFetchingApis(true));

      fetchWithAxios.post(`/functionality`,
        {
          // 'name': functionalityForm.name.value,
          'description': functionalityForm.description.value,
          'category_id': functionalityForm.project_id.value,
          'api': functionalityForm.api.value,
          'method': functionalityForm.method.value[0],
          'price': parseInt(functionalityForm.price.value.toString()),
        },
      ).then((response) => {
        if (checkStatus({ status: response.data.status })) {
          onCloseModal();
        }
        updatePromiseToastSuccessWarningInfo({ toastId, response });

      }).catch((error) => {
        updatePromiseToastError({ toastId, error });
      }).finally(() => {
        dispatch(setIsFetchingApis(false));
      });
    }
  };

  const changeInputs = useCallback((event) => {
    const { name, value } = event.target;
    setFunctionalityForm((prev) => ({
      ...prev, [name]: {
        ...prev[name],
        value,
        isInvalid: false,
      },
    }));
  }, []);

  const changeSwitch = (event) => {
    const { name, checked } = event.target;
    setFunctionalityForm((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        value: checked,
        isInvalid: false,
      },
    }));
  };

  return (
    <Base buttonId={buttonId}
          box_shadow={false}
          backNone={true}
          w={'100%'}
          ml={'0'}
          mr={'0'}
          px={'0'}
          submitTitle={giveText(17)}
          title={editing ? giveText(121) : giveText(114)}
          submitFunc={editing ? () => editApisAxios({
            functionalityForm: functionalityForm,
            onCloseModal: onCloseModal,
            index: functionalityForm.id,
            setFunctionalityForm,
          }) : addFunctionalitiesAxios}
          hasCancelButton={false}
          onCloseModal={onCloseModal}
          hasSubmitButton={true}
          hasExtensionButton={true}
          isLoadingSubmitButton={isLoadingSlice.isFetchingApis}
          Content={(
            <FunctionalityFormData apiForm={functionalityForm}
                                   buttonId={buttonId}
                                   setApiForm={setFunctionalityForm}
                                   changeInputs={changeInputs}
                                   changeSwitch={changeSwitch}
                                   methodOptions={methodOptions} />
          )} 
          />
  );
};
