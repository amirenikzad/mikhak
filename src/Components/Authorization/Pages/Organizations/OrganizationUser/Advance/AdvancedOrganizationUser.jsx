import { useMemo, useState } from 'react';
import { Box, HStack, Stack, Text } from '@chakra-ui/react';
import { motion } from 'motion/react';
import { Base } from '../../../../../Authentication/Base.jsx';
import { selectStylesAddSection } from '../../../../../Base/Attributes.jsx';
import Select from 'react-select';
import { useSelector } from 'react-redux';
import { giveText } from '../../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchWithAxios } from '../../../../../Base/axios/FetchAxios.jsx';
import { GET_USER_NO_ADMIN } from '../../../../../Base/UserAccessNames.jsx';
import { OrganizationTableTab } from './OrganizationTableTab.jsx';
import { useActiveInactiveAll } from '../../../../../Base/CustomHook/useActiveInactiveAll.jsx';
import { useColorMode } from '../../../../../ui/color-mode.jsx';

export default function AdvancedOrganizationUser() {
  const accessSlice = useSelector(state => state.accessSlice);
  const [userOptions, setUserOptions] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});
  const [selectInputValue, setSelectInputValue] = useState('');
  const { colorMode } = useColorMode();
  const queryClient = useQueryClient();
  const reactQueryItemName = useMemo(() => 'all_organization_user_list', []);
  const setORCatchAllURL = useMemo(() => '/set_unset_user_org', []);

  const allUsersAxios = async () => {
    if (accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_USER_NO_ADMIN)) {
      const response = await fetchWithAxios.get(`/user/non_admin/all?page=1&page_size=20&search=${selectInputValue}`);
      setUserOptions(response.data.users.map((user) => ({
        label: user.username,
        value: user.id,
      })));

      setSelectedUser({ label: response.data.users[0].username, value: parseInt(response.data.users[0].id) });
      return response;
    } else {
      return null;
    }
  };

  const { isFetching: isFetchingUsers } = useQuery({
    queryKey: ['all_users_list', selectInputValue],
    queryFn: allUsersAxios,
    refetchOnWindowFocus: false,
  });

  const { More } = useActiveInactiveAll({
    setORCatchAllURL: setORCatchAllURL,
    setORCatchAllParameter: 'user_id',
    setORCatchAllUpdate: () => queryClient.invalidateQueries({ queryKey: [reactQueryItemName] }).then(() => null),
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ height: 'inherit' }}>
      <Base title={giveText(102)}
            hasSubmitButton={false}
            px={'0'}
            mr={0}
            ml={0}
            Content={
              <Stack gap={3}>
                <HStack spacing={3}>
                  <Text my={'auto'} fontWeight={'500'} w={'200px'}>{giveText(51)}:</Text>
                  <Box w={'100%'}>
                    <Select options={userOptions}
                            autoFocus
                            styles={selectStylesAddSection({ colorMode: colorMode })}
                            loading={isFetchingUsers}
                            loadingMessage={() => giveText(150)}
                            value={{ label: selectedUser.label, value: selectedUser.id }}
                            onInputChange={(newValue) => {
                              setSelectInputValue(newValue);
                            }}
                            onChange={(event) => {
                              setSelectedUser({
                                label: event.label,
                                value: parseInt(event.value),
                              });
                            }} />
                  </Box>
                </HStack>

                <OrganizationTableTab user_id={selectedUser.value} reactQueryItemName={reactQueryItemName} />

                {(accessSlice.isAdmin || accessSlice.userAccess?.includes(`${setORCatchAllURL}_post`)) &&
                  More({ id: selectedUser.value })
                }
              </Stack>
            }
      />
    </motion.div>
  );
};
