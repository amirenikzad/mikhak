import { useCallback, useMemo, useState } from 'react';
import {
  showToast,
  checkStatus,
  promiseToast,
  handleErrors,
  updatePromiseToastError,
  updatePromiseToastSuccessWarningInfo,
} from '../../../../../Base/BaseFunction.jsx';
import { motion } from 'motion/react';
import { Base } from '../../../../../Authentication/Base.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { setHasUpdatedService } from '../../../../../../store/features/updatedSlice.jsx';
import { FormData } from './FormData.jsx';
import { giveText } from '../../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { fetchWithAxios } from '../../../../../Base/axios/FetchAxios.jsx';
import { setIsFetchingRole } from '../../../../../../store/features/isLoadingSlice.jsx';
import { POST_SERVICE, PUT_SERVICE } from '../../../../../Base/UserAccessNames.jsx';
import { useQueryClient } from '@tanstack/react-query';

export default function AddEditService({ onCloseModal, service = {}, editing, putAxios }) {
  const accessSlice = useSelector(state => state.accessSlice);
  const cropImageSlice = useSelector(state => state.cropImageSlice);
  const updatedSlice = useSelector(state => state.updatedSlice);
  const isLoadingSlice = useSelector(state => state.isLoadingSlice);
  const [serviceForm, setServiceForm] = useState({
    id: { value: editing ? service.id : '', isInvalid: false },
    fa_name: { value: editing ? service.fa_name : '', isInvalid: false },
    en_name: { value: editing ? service.en_name : '', isInvalid: false },
    fa_description: { value: editing ? service.fa_description : '', isInvalid: false },
    en_description: { value: editing ? service.en_description : '', isInvalid: false },
    light_icon: { value: editing ? service.light_icon : '', isInvalid: false },
    dark_icon: { value: editing ? service.dark_icon : '', isInvalid: false },
    ui_path: { value: editing ? service.ui_path : '', isInvalid: false },
    // active: { value: editing ? service.active : true, isInvalid: false },
    // show: { value: editing ? service.show : true, isInvalid: false },
    // for_sell: { value: editing ? service.for_sell : true, isInvalid: false },
    // edition: {
    //   value: editing ? (service.edition_id ?? null) : null,
    //   isInvalid: false
    // },
    // edition: {
    //   // value: editing && service.edition_name ? "temp_edition_id" : null,
    //   value: editing ? (service.edition_id ?? null) : null,
    //   // id: editing && service.edition_id ? service.edition_id : null,
    //   label: editing && service.edition_name ? service.edition_name : 'بدون نوع محصول',
    //   isInvalid: false
    // },
    edition: {
      value: editing ? service.edition_id : null,
      isInvalid: false
    },
    edition_id: { value: editing ? service.edition_id : null, isInvalid: false },
    edition_label: { value: editing ? service.edition_name || 'بدون نوع محصول' : 'بدون نوع محصول', isInvalid: false },

    maximum_user: { value: editing ? service.maximum_user ?? 0 : 0, isInvalid: false },
    major: { value: editing ? service.major ?? 0 : 0, isInvalid: false },
    minor: { value: editing ? service.minor ?? 0 : 0, isInvalid: false },
    patch: { value: editing ? service.patch ?? 0 : 0, isInvalid: false },

    // category: {
    //   value: editing ? service.category_name : null,
    //   isInvalid: false
    // },
    category: {
      value: service.category_id,
      label: service.category_name
    },

    category_id: { value: editing ? service.category_id : null, isInvalid: false },
    // category_label: { value: editing ? service.category_name || 'بدون نوع محصول' : 'بدون نوع محصول', isInvalid: false },
    category_label: {
      // value: service.category_id,
      value: service.category_name,
      // label: service.category_name
    },

    cat_id: { value: editing ? service.category_id : null, isInvalid: false },
  });
  const dispatch = useDispatch();
  const buttonId = useMemo(() => 'service_submit_id', []);
  const queryClient = useQueryClient();

  const addServiceAxios = () => {
    if (!accessSlice.isAdmin && !accessSlice.userAccess?.includes(POST_SERVICE)) {
      showToast({
        title: giveText(30),
        description: giveText(97),
        status: 2,
      });

    } else if (serviceForm.fa_name.value === ''
      || serviceForm.en_name.value === ''
      || serviceForm.ui_path.value === ''
      || !serviceForm.edition?.value
      || serviceForm.serviceCroppedImageDark
      || serviceForm.serviceCroppedImageLight) {
      showToast({
        title: giveText(30),
        description: giveText(26),
        status: 2,
      });
      handleErrors(serviceForm, setServiceForm, [
        'fa_name',
        'en_name',
        'fa_description',
        'en_description',
        'ui_path',
        'edition',
      ]);

    } else {
      const toastId = promiseToast();
      dispatch(setIsFetchingRole(true));

      fetchWithAxios.post(`/service`, {
          fa_name: serviceForm.fa_name.value,
          en_name: serviceForm.en_name.value,
          fa_description: serviceForm.fa_description.value,
          en_description: serviceForm.en_description.value,
          ui_path: serviceForm.ui_path.value,
          light_icon: cropImageSlice.serviceCroppedImageLight ? cropImageSlice.serviceCroppedImageLight : serviceForm.light_icon.value,
          extension_light_icon: 'png',
          dark_icon: cropImageSlice.serviceCroppedImageDark ? cropImageSlice.serviceCroppedImageDark : serviceForm.dark_icon.value,
          extension_dark_icon: 'png',
          // active: serviceForm.active.value,
          // show: serviceForm.show.value,
          // for_sell: serviceForm.for_sell.value,
          edition_id: serviceForm.edition.value,
          maximum_user: String(serviceForm.maximum_user.value ?? 0),
          major: Number(serviceForm.major.value ?? 0),
          minor: Number(serviceForm.minor.value ?? 0),
          patch: Number(serviceForm.patch.value ?? 0),
          // cat_id: Number(serviceForm.cat_id.value ?? 0),
          cat_id: serviceForm.category.value,

        },
      ).then((response) => {
        if (checkStatus({ status: response.data.status })) {
          onCloseModal();
        }
        dispatch(setHasUpdatedService(!updatedSlice.hasUpdatedService));
        queryClient.invalidateQueries({ queryKey: ['get_all_services'] });
        updatePromiseToastSuccessWarningInfo({ toastId, response });

      }).catch((error) => {
        updatePromiseToastError({ toastId, error });
      }).finally(() => {
        dispatch(setIsFetchingRole(false));
      });
    }
  };

  const editRoleAxios = () => {
    if (!accessSlice.isAdmin && !accessSlice.userAccess?.includes(PUT_SERVICE)) {
      showToast({
        title: giveText(30),
        description: giveText(97),
        status: 2,
      });

    } else if (serviceForm.fa_name.value === ''
      || serviceForm.en_name.value === ''
      || serviceForm.ui_path.value === ''
      || !serviceForm.edition?.value
      || serviceForm.serviceCroppedImageDark
      || serviceForm.serviceCroppedImageLight) {
      showToast({
        title: giveText(30),
        description: giveText(26),
        status: 2,
      });
      handleErrors(serviceForm, setServiceForm, [
        'fa_name',
        'en_name',
        'fa_description',
        'en_description',
        'ui_path',
        'edition',
      ]);

    } else {
      const toastId = promiseToast();
      dispatch(setIsFetchingRole(true));

      putAxios({
        id: serviceForm.id.value,
        fa_name: serviceForm.fa_name.value,
        en_name: serviceForm.en_name.value,
        ui_path: serviceForm.ui_path.value,
        fa_description: serviceForm.fa_description.value,
        en_description: serviceForm.en_description.value,
        light_icon: cropImageSlice.serviceCroppedImageLight ? cropImageSlice.serviceCroppedImageLight : serviceForm.light_icon.value,
        extension_light_icon: 'png',
        dark_icon: cropImageSlice.serviceCroppedImageDark ? cropImageSlice.serviceCroppedImageDark : serviceForm.dark_icon.value,
        extension_dark_icon: 'png',
        // active: service.active,
        // show: serviceForm.show.value,
        // for_sell: serviceForm.for_sell?.value,
        edition_id: serviceForm.edition?.value ?? null,
        maximum_user: String(serviceForm.maximum_user.value ?? 0),
        major: Number(serviceForm.major.value ?? 0),
        minor: Number(serviceForm.minor.value ?? 0),
        patch: Number(serviceForm.patch.value ?? 0),
        // cat_id: Number(serviceForm.cat_id.value ?? 0),
        cat_id: serviceForm.category.value,
      }).then((response) => {
        dispatch(setHasUpdatedService(!updatedSlice.hasUpdatedService));
        queryClient.invalidateQueries({ queryKey: ['get_all_services'] });
        onCloseModal();
        updatePromiseToastSuccessWarningInfo({ toastId, response });
      }).catch((error) => {
        updatePromiseToastError({ toastId, error });
      }).finally(() => {
        dispatch(setIsFetchingRole(false));
      });
    }
  };

  const changeInputs = useCallback((event) => {
    const { name, value } = event.target;
    setServiceForm((prev) => ({ ...prev, [name]: { ...prev[name], value, isInvalid: false } }));
  }, []);

  const changeSwitch = useCallback((event) => {
    const { name, checked } = event.target;
    setServiceForm((prev) => ({ ...prev, [name]: { value: checked, isInvalid: false } }));
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ height: 'inherit' }}>
      <Base title={editing ? giveText(295) : giveText(294)}
            onCloseModal={onCloseModal}
            px={0}
            mr={0}
            ml={0}
            box_shadow={false}
            hasSubmitButton={false}
            hasCancelButton={false}
            Content={<FormData changeInputs={changeInputs}
                               changeSwitch={changeSwitch}
                               buttonId={buttonId}
                               form={serviceForm}
                               setForm={setServiceForm}
                               submitFunc={editing ? editRoleAxios : addServiceAxios}
                               submitTitle={giveText(17)}
                               isLoadingSubmitButton={isLoadingSlice.isFetchingRole} />} />
    </motion.div>
  );
};
