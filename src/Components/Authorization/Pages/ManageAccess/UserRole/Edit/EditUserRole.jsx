import { HStack, Separator, Stack, Text } from '@chakra-ui/react';
import { motion } from 'motion/react';
import { Base } from '../../../../../Authentication/Base.jsx';
import { giveText } from '../../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { RoleTableTab } from './RoleTableTab.jsx';
import { useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useActiveInactiveAll } from '../../../../../Base/CustomHook/useActiveInactiveAll.jsx';
import { useColorMode } from '../../../../../ui/color-mode.jsx';
import { useSelector } from 'react-redux';

export default function EditUserRole({ selectedUser = {} }) {
  const accessSlice = useSelector(state => state.accessSlice);
  const reactQueryItemName = useMemo(() => 'all_permissions_list', []);
  const setORCatchAllURL = useMemo(() => '/set_unset_user_role', []);
  const queryClient = useQueryClient();
  const { colorMode } = useColorMode();

  const { More } = useActiveInactiveAll({
    setORCatchAllURL: setORCatchAllURL,
    setORCatchAllParameter: 'user_id',
    setORCatchAllUpdate: () => queryClient.invalidateQueries({ queryKey: [reactQueryItemName] }).then(() => null),
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ height: 'inherit' }}>
      <Base title={giveText(49)}
            hasSubmitButton={false}
            px={0}
            ml={0}
            mr={0}
            box_shadow={false}
            minW={'100%'}
            Content={
              <Stack gap={3}>
                <HStack spacing={3}>
                  <Text my={'auto'} fontWeight={'500'} w={'200px'}>{giveText(14)}:</Text>
                  <Text my={'auto'} fontWeight={'800'} fontSize={'17px'} w={'200px'}>{selectedUser.user_name}</Text>
                </HStack>

                <Separator borderColor={colorMode === 'light' ? 'black' : 'white'} />

                <RoleTableTab user_id={selectedUser.user_id} reactQueryItemName={reactQueryItemName} />

                {(accessSlice.isAdmin || accessSlice.userAccess?.includes(`${setORCatchAllURL}_post`)) &&
                  More({ id: selectedUser.user_id })
                }
              </Stack>
            }
      />
    </motion.div>
  );
};
