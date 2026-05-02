import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  checkStatus,
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
import { setIsFetchingOrganization } from '../../../../../../store/features/isLoadingSlice.jsx';
import { setCroppedImage } from '../../../../../../store/features/cropImageSlice.jsx';

export default function AddEditOrganization({ onCloseModal, organization = {}, editing, organizationList = [] }) {
  const mapOrganizationSlice = useSelector(state => state.mapOrganizationSlice);
  const cropImageSlice = useSelector(state => state.cropImageSlice);
  const isLoadingSlice = useSelector(state => state.isLoadingSlice);
  const [organizationForm, setOrganizationForm] = useState({
    name: { value: editing ? organization.name : '', isInvalid: false },
    organization_type: { value: editing ? organization.organization_type : '', isInvalid: false },
    image: { value: editing ? organization.image : '', isInvalid: false },
    extension: { value: editing ? organization.extension : '', isInvalid: false },
    email: { value: editing ? organization.email : '', isInvalid: false },
    phone_number: { value: editing ? organization.phone_number : '', isInvalid: false },
    number: { value: editing ? organization.number : '', isInvalid: false },
    lat: { value: editing ? organization.lat : '', isInvalid: false },
    long: { value: editing ? organization.long : '', isInvalid: false },
    address: { value: editing ? organization.address : '', isInvalid: false },
    profiling_id: { value: editing ? organization.profiling_id : '', isInvalid: false },
    parent_name: { value: editing ? organization.parent_name : null, isInvalid: false },
    parent_id: { value: editing ? organization.parent_id : null, isInvalid: false },
    admin_name: { value: editing ? organization.admin_name : '', isInvalid: false },
    platform_name: { value: editing ? organization.platform_name : '', isInvalid: false },
    admin_id: { value: editing ? organization.admin_id : '', isInvalid: false },
    admin_profile_pic: { value: editing ? organization.admin_profile_pic : '', isInvalid: false },
    // login_platform: { value: editing ? organization.platform_id : '', isInvalid: false },
    // platform_name: { value: editing ? organization.id : '', isInvalid: false },
  });
  // console.log("organizationForm:", organizationForm);
  const dispatch = useDispatch();
  const buttonId = useMemo(() => 'organization_submit_id', []);

  useEffect(() => {
    dispatch(setCroppedImage(null));
  }, []);

  const addOrganizationAxios = () => {
    const toastId = promiseToast();
    dispatch(setIsFetchingOrganization(true));

    fetchWithAxios.post('/organization',
      {
        'name': organizationForm.name.value,
        'image': cropImageSlice.croppedImage === null ? null : cropImageSlice.croppedImage,
        'extension': cropImageSlice.croppedImageFileType ? cropImageSlice.croppedImageFileType : null,
        'organization_type': organizationForm.organization_type.value,
        'email': organizationForm.email.value,
        'number': organizationForm.number.value,
        'phone_number': organizationForm.phone_number.value,
        'lat': organizationForm.lat.value.toString(),
        'long': organizationForm.long.value.toString(),
        'address': organizationForm.address.value,
        'profiling_id': organizationForm.profiling_id.value,
        'parent_id': organizationForm.parent_id.value,
        // 'admin_id': Number(organizationForm.admin_name.value),
        // 'admin_id': Number(organizationForm.admin_id.value),
        'admin_id': organizationForm.admin_id.value,
        'login_platform': organizationForm.platform_id.value.toString(),
      },
    ).then((response) => {
      if (checkStatus({ status: response.data.status })) {
        onCloseModal();
      }
      updatePromiseToastSuccessWarningInfo({ toastId, response });
    }).catch((error) => {
      updatePromiseToastError({ toastId, error });
    }).finally(() => {
      dispatch(setIsFetchingOrganization(false));
    });
  };

  const editOrganizationAxios = () => {
    const toastId = promiseToast();
    dispatch(setIsFetchingOrganization(true));

    fetchWithAxios.put('/organization', {
        'id': organization.id,
        'name': organizationForm.name.value,
        'image': cropImageSlice.croppedImage === null ? organizationForm.image.value : cropImageSlice.croppedImage,
        'extension': cropImageSlice.croppedImageFileType ? cropImageSlice.croppedImageFileType : organizationForm.extension.value,
        'organization_type': organizationForm.organization_type.value,
        'email': organizationForm.email.value,
        'number': organizationForm.number.value,
        'phone_number': organizationForm.phone_number.value,
        'lat': organizationForm.lat.value.toString(),
        'long': organizationForm.long.value.toString(),
        'address': organizationForm.address.value,
        'profiling_id': organizationForm.profiling_id.value,
        'parent_id': organizationForm.parent_id.value,
        'admin_id': organizationForm.admin_id.value,
      },
    ).then((response) => {
      onCloseModal();
      updatePromiseToastSuccessWarningInfo({ toastId, response });
    }).catch((error) => {
      updatePromiseToastError({ toastId, error });
    }).finally(() => {
      dispatch(setIsFetchingOrganization(false));
    });
  };

  const changeInputs = useCallback((event) => {
    const { name, value } = event.target;
    setOrganizationForm((prev) => ({ ...prev, [name]: { ...prev[name], value, isInvalid: false } }));
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ height: 'inherit' }}>
      <Base w={mapOrganizationSlice.hasExpandedMap ? '100%' : '600px'}
            px={0}
            ml={0}
            mr={0}
            box_shadow={false}
            backNone={true}
            title={editing ? giveText(134) : giveText(133)}
            hasSubmitButton={false}
            Content={<FormData submitFunc={editing ? editOrganizationAxios : addOrganizationAxios}
                               onCloseModal={onCloseModal}
                               isLoadingSubmitButton={isLoadingSlice.isFetchingOrganization}
                               changeInputs={changeInputs}
                               buttonId={buttonId}
                               organizationForm={organizationForm}
                               setOrganizationForm={setOrganizationForm}
                                editing={editing}
                               organizationList={organizationList} />}
                                />
    </motion.div>
  );
}
