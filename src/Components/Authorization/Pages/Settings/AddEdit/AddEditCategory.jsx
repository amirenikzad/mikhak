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
import { FormData3 } from './FormData3.jsx';
import { giveText } from '../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { fetchWithAxios } from '../../../../Base/axios/FetchAxios.jsx';
import { setIsFetchingRole } from '../../../../../store/features/isLoadingSlice.jsx';
import { POST_CATEGORY, PUT_CATEGORY } from '../../../../Base/UserAccessNames.jsx';

export default function AddEditCategory({ onCloseModal, category = {}, editing }) {
  const accessSlice = useSelector(state => state.accessSlice);
  const isLoadingSlice = useSelector(state => state.isLoadingSlice);
  const [categoryForm, setCategoryForm] = useState({
    category_name: { value: editing ? category.category_name : '', isInvalid: false },
    cat_id: { value: editing ? category.id : '', isInvalid: false },
  });
  console.log('category categoryForm',categoryForm);
  const dispatch = useDispatch();
  const buttonId = useMemo(() => 'category_submit_id', []);

  const addCategoryAxios = () => {
    if (!accessSlice.isAdmin && !accessSlice.userAccess?.includes(POST_CATEGORY)) {
      showToast({
        title: giveText(30),
        description: giveText(97),
        status: 2,
      });

    } else if (categoryForm.category_name.value === '') {
      showToast({
        title: giveText(30),
        description: giveText(26),
        status: 2,
      });
      handleErrors(categoryForm, setCategoryForm, ['category_name']);
      handleErrors(categoryForm, setCategoryForm, ['cat_id']);

    } else {
      const toastId = promiseToast();
      dispatch(setIsFetchingRole(true));

    //   fetchWithAxios.post(`/category?category_name=${categoryForm.category_name.value}`, {})
    fetchWithAxios.post('/category', {
        category_name: categoryForm.category_name.value,
        })

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

  const editCategoryAxios = () => {
    if (!accessSlice.isAdmin && !accessSlice.userAccess?.includes(PUT_CATEGORY)) {
      showToast({
        title: giveText(30),
        description: giveText(97),
        status: 2,
      });

    } else if (categoryForm.category_name.value === '') {
      showToast({
        title: giveText(30),
        description: giveText(26),
        status: 2,
      });
      handleErrors(categoryForm, setCategoryForm, ['category_name']);
      handleErrors(categoryForm, setCategoryForm, ['cat_id']);

    } else {
      const toastId = promiseToast();
      dispatch(setIsFetchingRole(true));
      console.log('categoryForm2',categoryForm);

    //   fetchWithAxios.put(`/category?category_name=${categoryForm.category_name.value}&cat_id=${categoryForm.cat_id.value}`, {})
    fetchWithAxios.put('/category', {
        category_name: categoryForm.category_name.value,
        cat_id: categoryForm.cat_id.value,
        })

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
    setCategoryForm((prev) => ({ ...prev, [name]: { ...prev[name], value, isInvalid: false } }));
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ height: 'inherit' }}>
      <Base buttonId={buttonId}
            submitTitle={giveText(17)}
            title={editing ? giveText(453) : giveText(454)}
            submitFunc={editing ? editCategoryAxios : addCategoryAxios}
            onCloseModal={onCloseModal}
            isLoadingSubmitButton={isLoadingSlice.isFetchingCategory}
            hasSubmitButton={true}
            hasCancelButton={false}
            w={'100%'}
            px={0}
            ml={0}
            mr={0}
            Content={<FormData3 changeInputs={changeInputs} buttonId={buttonId} registerForm={categoryForm} />} />
    </motion.div>
  );
};
