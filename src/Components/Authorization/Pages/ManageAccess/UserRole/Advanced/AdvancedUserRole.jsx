import { useMemo, useState } from 'react';
import { Box, Center, HStack, Stack, Text } from '@chakra-ui/react';
import { Base } from '../../../../../Authentication/Base.jsx';
import { selectStylesAddSection } from '../../../../../Base/Attributes.jsx';
import Select from 'react-select';
import { useSelector } from 'react-redux';
import { giveText } from '../../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { fetchWithAxios } from '../../../../../Base/axios/FetchAxios.jsx';
import { UserTableTab } from './UserTableTab.jsx';
import { GET_ALL_ROLES } from '../../../../../Base/UserAccessNames.jsx';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useActiveInactiveAll } from '../../../../../Base/CustomHook/useActiveInactiveAll.jsx';
import { useColorMode } from '../../../../../ui/color-mode.jsx';

export default function AdvancedUserRole() {
  const accessSlice = useSelector(state => state.accessSlice);
  const [roleOptions, setRoleOptions] = useState([]);
  const [selectedRole, setSelectedRole] = useState({});
  const [selectInputValue, setSelectInputValue] = useState('');
  const { colorMode } = useColorMode();
  const reactQueryItemName = useMemo(() => 'all_users_list', []);
  const setORCatchAllURL = useMemo(() => '/set_unset_role_user', []);
  const queryClient = useQueryClient();

  const allRolesAxios = async () => {
    if (accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ALL_ROLES)) {
      const response = await fetchWithAxios.get(`/role/all?page=1&page_size=20&search=${selectInputValue}`);
      setRoleOptions(response.data.roles.map((roleNames) => ({
        label: roleNames.role_name,
        value: roleNames.id,
      })));

      setSelectedRole({ label: response.data.roles[0].role_name, value: parseInt(response.data.roles[0].id) });

      return response;
    } else {
      return [];
    }
  };

  const { isFetching: isFetchingRoles } = useQuery({
    queryKey: ['all_roles_list', selectInputValue],
    queryFn: allRolesAxios,
    refetchOnWindowFocus: false,
  });

  const { More } = useActiveInactiveAll({
    setORCatchAllURL: setORCatchAllURL,
    setORCatchAllParameter: 'role_id',
    setORCatchAllUpdate: () => queryClient.invalidateQueries({ queryKey: [reactQueryItemName] }).then(() => null),
  });

  return (
    <Center>
      <Base title={giveText(102)}
            hasSubmitButton={false}
            px={0}
            mr={0}
            ml={0}
            w={'100%'}
            Content={
              <Stack gap={3}>
                <HStack spacing={3}>
                  <Text my={'auto'} fontWeight={'500'} w={'200px'}>{giveText(44)}:</Text>
                  <Box w={'100%'}>
                    {(accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ALL_ROLES)) &&
                      <Select options={roleOptions}
                              styles={selectStylesAddSection({ colorMode: colorMode })}
                              autoFocus
                              loading={isFetchingRoles}
                              loadingMessage={() => giveText(150)}
                              value={{ label: selectedRole.label, value: selectedRole.id }}
                              onInputChange={(newValue) => {
                                setSelectInputValue(newValue);
                              }}
                              onChange={(event) => {
                                setSelectedRole({
                                    label: event.label,
                                    value: parseInt(event.value),
                                  },
                                );
                              }} />
                    }
                  </Box>
                </HStack>

                <UserTableTab role_id={selectedRole.value} reactQueryItemName={reactQueryItemName} />

                {(accessSlice.isAdmin || accessSlice.userAccess?.includes(`${setORCatchAllURL}_post`)) &&
                  More({ id: selectedRole.value })
                }
              </Stack>
            } />
    </Center>
  );
};
