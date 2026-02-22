import { memo, useMemo } from 'react';
import { giveDir, giveText } from '../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { commaForEvery3Digit } from '../../../../Base/BaseFunction.jsx';
import { Text, Box, Table, Center } from '@chakra-ui/react';
import { TableText, User } from '../../../../Base/Extensions.jsx';
import { GET_ACTIVE_USERS } from '../../../../Base/UserAccessNames.jsx';
import { fetchWithAxios } from '../../../../Base/axios/FetchAxios.jsx';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { MedalFillIcon } from '../../../../Base/CustomIcons/MedalFillIcon.jsx';
import { MENU_BACKGROUND_DARK } from '../../../../Base/BaseColor.jsx';
import { useColorMode } from '../../../../ui/color-mode.jsx';
import { motion } from 'motion/react';

export const TopTenUsersTable = memo(function TopTenUsersTable({ height, scrollHeight }) {
  const accessSlice = useSelector(state => state.accessSlice);
  const refetchInterval = useMemo(() => 5 * 60 * 1000, []);
  const { colorMode } = useColorMode();

  const activeUsersAxios = async () => {
    if (accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ACTIVE_USERS)) {
      const response = await fetchWithAxios.get('/top_ten_users');
      return response.data.result;
    } else {
      return null;
    }
  };

  const {
    data: activeUsersData,
  } = useQuery({
    queryKey: ['topTenUsersData', accessSlice],
    queryFn: activeUsersAxios,
    refetchOnWindowFocus: false,
    refetchInterval: refetchInterval,
  });

  const medalColor = (index) => {
    switch (index) {
      case 0:
        return '#ffd80c';
      case 1:
        return '#9a9999';
      case 2:
        return '#CD7F32';
    }
  };

  return (
    <motion.div initial={{ scale: 1 }} whileHover={{ scale: 1.01 }}>
      <Box borderWidth={1} pt={3} boxShadow={'lg'} borderRadius={8} h={height}>
        <Text px={4} fontSize={'18px'} fontWeight={'500'} cursor={'default'}>{giveText(368)}</Text>

        <Box px={3} py={3}>
          <Table.ScrollArea height={scrollHeight}>
            <Table.Root size={'lg'} stickyHeader>
              <Table.Header>
                <Table.Row backgroundColor={colorMode === 'light' ? 'white' : MENU_BACKGROUND_DARK}>
                  <Table.ColumnHeader py={1} color={'gray.600'} fontSize={'14px'} fontWeight={'bold'}>
                    <Center>
                      {giveText(0)}
                    </Center>
                  </Table.ColumnHeader>
                  <Table.ColumnHeader py={1} color={'gray.600'} fontSize={'14px'} fontWeight={'bold'}>
                    <Center>
                      {giveText(200)}
                    </Center>
                  </Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {activeUsersData?.map((item, index) => (
                  <Table.Row key={index} backgroundColor={colorMode === 'light' ? 'transparent' : MENU_BACKGROUND_DARK}>
                    <Table.Cell py={3} px={4}>
                      <Box position={'relative'}>
                        <User gap={0}
                              userInfo={{
                                username: item?.user_id.username,
                                profile_pic: item?.user_id.profile_pic,
                              }} />
                        {index < 3 &&
                          <Box position={'absolute'}
                               bottom={-4}
                               left={giveDir() === 'ltr' ? 1 : null}
                               right={giveDir() === 'ltr' ? null : 1}>
                            <MedalFillIcon width={'2rem'} color={medalColor(index)} />
                          </Box>
                        }
                      </Box>
                    </Table.Cell>
                    <Table.Cell py={3} px={4}>
                      <TableText cursor={'default'}
                                 text={`${commaForEvery3Digit(item?.amount)} ${giveText(213)}`}
                                 maxLength={20} />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Table.ScrollArea>
        </Box>
      </Box>
    </motion.div>
  );
});
