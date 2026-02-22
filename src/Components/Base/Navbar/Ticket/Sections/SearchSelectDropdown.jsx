import { memo } from 'react';
import { NativeSelect } from '@chakra-ui/react';
import { giveText } from '../../../MultiLanguages/HandleLanguage.jsx';

export const SearchSelectDropdown = memo(function SelectDropdown({ searchFilter, setSearchFilter }) {
  return (
    <NativeSelect.Root size="xs"
                       variant="plain"
                       width="auto"
                       mr={1}
                       onChange={(e) => {
                         setSearchFilter(e.target.value);
                       }}>
      <NativeSelect.Field defaultValue={searchFilter} fontSize="sm">
        <option value="category">{giveText(220)}</option>
        <option value="subject">{giveText(336)}</option>
        <option value="description">{giveText(38)}</option>
        <option value="created_time">{giveText(337)}</option>
        <option value="closed_time">{giveText(338)}</option>
      </NativeSelect.Field>
      <NativeSelect.Indicator />
    </NativeSelect.Root>
  );
});
