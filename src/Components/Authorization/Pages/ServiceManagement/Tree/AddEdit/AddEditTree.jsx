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
import { FormData as TreeFormData } from './FormData.jsx';
import { fetchWithAxios } from '../../../../../Base/axios/FetchAxios.jsx';
import { setIsFetchingApis } from '../../../../../../store/features/isLoadingSlice.jsx';
import { POST_FUNCTIONALITIES } from '../../../../../Base/UserAccessNames.jsx';
import { createListCollection } from '@chakra-ui/react';

export default function AddEditTree({
                                               onCloseModal,
                                               formField = {} | '',
                                               editApisAxios,
                                               editing = false,
                                             }) {
  const accessSlice = useSelector(state => state.accessSlice);
  const isLoadingSlice = useSelector(state => state.isLoadingSlice);
  const dispatch = useDispatch();
  const [TreeForm, setTreeForm] = useState({
    id: formField?.id,
    name: { value: editing ? formField?.name : '', isInvalid: false },
    description: { value: editing ? formField?.description : '', isInvalid: false },
    price: { value: editing ? formField?.price : 0, isInvalid: false },
    project_id: { value: editing ? String(formField?.id) : 0, isInvalid: false },
    category_name: { value: editing ? formField?.category_name : '', isInvalid: false },
    api: { value: editing ? formField?.api : '', isInvalid: false },
    method: { value: editing ? formField?.method : '', isInvalid: false },
    project_light_icon: { value: editing ? formField?.project_light_icon : '', isInvalid: false },
    project_dark_icon: { value: editing ? formField?.project_dark_icon : '', isInvalid: false },
  });
  // console.log("TreeForm end",TreeForm);
  // console.log("formField end",formField);
  const methodOptions = createListCollection({
    items: [
      { value: 'post', label: 'POST' },
      { value: 'get', label: 'GET' },
      { value: 'put', label: 'PUT' },
      { value: 'delete', label: 'DELETE' },
      { value: 'patch', label: 'PATCH' },
    ],
  });
  const buttonId = useMemo(() => 'Tree_submit_id', []);

  const addFunctionalitiesAxios = () => {
    if (!accessSlice.isAdmin && !accessSlice.userAccess?.includes(POST_FUNCTIONALITIES)) {
      showToast({
        title: giveText(30),
        description: giveText(97),
        status: 2,
      });

    } else if (
      // TreeForm.name.value === '' ||
      TreeForm.project_id.value === '' ||
      TreeForm.api.value === '' ||
      TreeForm.method.value === '') {
      showToast({
        title: giveText(30),
        description: giveText(26),
        status: 2,
      });
      handleErrors(TreeForm,
        setTreeForm,
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

      fetchWithAxios.post(`/tree`,
        {
          // 'name': TreeForm.name.value,
          'description': TreeForm.description.value,
          'category_id': TreeForm.project_id.value,
          'api': TreeForm.api.value,
          'method': TreeForm.method.value[0],
          'price': parseInt(TreeForm.price.value.toString()),
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
    setTreeForm((prev) => ({
      ...prev, [name]: {
        ...prev[name],
        value,
        isInvalid: false,
      },
    }));
  }, []);

  const changeSwitch = (event) => {
    const { name, checked } = event.target;
    setTreeForm((prev) => ({
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
          title={editing ? giveText(465) : giveText(114)}
          submitFunc={editing ? () => editApisAxios({
            TreeForm: TreeForm,
            onCloseModal: onCloseModal,
            index: TreeForm.id,
            setTreeForm,
          }) : addFunctionalitiesAxios}
          hasCancelButton={false}
          onCloseModal={onCloseModal}
          hasSubmitButton={true}
          hasExtensionButton={true}
          isLoadingSubmitButton={isLoadingSlice.isFetchingApis}
          Content={(
            <TreeFormData apiForm={TreeForm}
                                   buttonId={buttonId}
                                   setApiForm={setTreeForm}
                                   changeInputs={changeInputs}
                                   changeSwitch={changeSwitch}
                                   methodOptions={methodOptions} />
          )} 
          />
  );
};
