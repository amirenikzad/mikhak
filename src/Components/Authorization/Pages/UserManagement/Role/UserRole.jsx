import { Separator, Stack } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { giveText } from '../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { RoleTableTab } from '../../ManageAccess/UserRole/Edit/RoleTableTab.jsx';
import { GET_USER_ROLE, PUT_USER } from '../../../../Base/UserAccessNames.jsx';
import { Base } from '../../../../Authentication/Base.jsx';
import { useMemo } from 'react';

export default function UserRole({ usersList = {} }) {
  const accessSlice = useSelector(state => state.accessSlice);
  const reactQueryItemName = useMemo(() => 'all_user_roles', []);

  return (
    <Base title={giveText(379)}
          hasCancelButton={false}
          hasSubmitButton={false}
          backNone={true}
          box_shadow={false}
          px={0}
          mr={0}
          ml={0}
          w={'100%'}
          Content={(accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_USER_ROLE)) &&
            <Stack gap={4} mt={2}>
              {accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_USER) &&
                <Separator borderColor={'gray.500'} />
              }
              <RoleTableTab user_id={usersList.id} reactQueryItemName={reactQueryItemName} />
            </Stack>
          } />
  );
}
