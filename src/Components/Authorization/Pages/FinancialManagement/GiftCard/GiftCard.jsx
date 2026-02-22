import { useEffect } from 'react';
import { setBreadcrumbAddress } from '../../../../../store/features/baseSlice.jsx';
import { giveText } from '../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { useDispatch } from 'react-redux';

export default function GiftCard() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setBreadcrumbAddress([{
      type: 'text',
      text: giveText(254),
    }, {
      type: 'text',
      text: giveText(255),
    }]));
  }, []);

  return <>

  </>;
}
