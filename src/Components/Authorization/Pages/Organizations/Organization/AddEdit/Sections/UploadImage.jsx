import { AvatarUpload } from '../../../../../../Base/UploadImage/AvatarUpload.jsx';
import { setCroppedImage } from '../../../../../../../store/features/cropImageSlice.jsx';
import { PUT_ORGANIZATION } from '../../../../../../Base/UserAccessNames.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { memo, useEffect } from 'react';

const arePropsEqual = (prevProps, nextProps) => {
  if (prevProps.organizationForm?.image === nextProps.organizationForm?.image) {
    return true; // props are equal
  }
  return false; // props are not equal -> update the component
};

export const UploadImage = memo(function UploadImage({ organizationForm, setOrganizationForm }) {
  const accessSlice = useSelector((state) => state.accessSlice);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setCroppedImage(null));
  });

  return (
    <AvatarUpload image={organizationForm.image.value}
                  editable={accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_ORGANIZATION)}
                  setAvatarCroppedImage={(value) => {
                    dispatch(setCroppedImage(value));
                  }}
                  removeDo={() => {
                    setOrganizationForm(prevState => {
                      return {
                        ...prevState,
                        image: { value: '', isInvalid: prevState['isInvalid'] },
                      };
                    });
                  }} />
  );
}, arePropsEqual);
