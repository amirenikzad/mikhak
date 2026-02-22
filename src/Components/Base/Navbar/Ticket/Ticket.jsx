import { giveText } from '../../MultiLanguages/HandleLanguage.jsx';
import { useEffect, useState } from 'react';
import { BaseHeaderPage } from '../../../Authorization/Pages/BaseHeaderPage.jsx';
import { setBreadcrumbAddress } from '../../../../store/features/baseSlice.jsx';
import { useDispatch } from 'react-redux';
import { SearchSelectDropdown } from './Sections/SearchSelectDropdown.jsx';
import { TicketTable } from './TicketTable.jsx';

export default function Ticket() {
  const [searchValue, setSearchValue] = useState('');
  const [searchFilter, setSearchFilter] = useState('category');
  const dispatch = useDispatch();
  const [controller, setController] = useState();

  useEffect(() => {
    dispatch(setBreadcrumbAddress([
      { type: 'text', text: giveText(330) },
    ]));
  }, []);

  return <>
    <BaseHeaderPage hasAddButton={false}
                    title={giveText(330)}
                    description={giveText(334)}
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    hasInputRightElement={true}
                    controller={controller}
                    InputRightElement={<SearchSelectDropdown searchFilter={searchFilter}
                                                             setSearchFilter={setSearchFilter} />} />

    <TicketTable searchValue={searchValue} searchFilter={searchFilter} setController={setController} />
  </>;
}
