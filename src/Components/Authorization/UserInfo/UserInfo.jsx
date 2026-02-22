import { Box, Center, HStack, Separator, Spinner, Text } from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { giveText } from '../../Base/MultiLanguages/HandleLanguage.jsx';
import { GeneralInfo } from './GeneralInfo.jsx';
import { PasswordInfo } from './PasswordInfo.jsx';
import { useSelector } from 'react-redux';
import { SideTabs } from '../../Base/SideTabs.jsx';
import { useColorMode } from '../../ui/color-mode.jsx';

export default function UserInfo({
                                   errorGetAllUsers,
                                   isLoadingListAllUsers,
                                   usersList = {},
                                   closeModal,
                                   general_url,
                                   password_url,
                                   update,
                                   UserAccessNameGET,
                                   UserAccessNamePUT,
                                   UserAccessNamePassword,
                                   showable_current_password = true,
                                 }) {
  const accessSlice = useSelector(state => state.accessSlice);
  const { colorMode } = useColorMode();
  const [selectedTab, setSelectedTab] = useState(0);

  const hasAccessChangePassword = useMemo(() => {
    return accessSlice.isAdmin || accessSlice.userAccess?.includes(UserAccessNamePassword);
  }, [accessSlice.isAdmin, accessSlice.userAccess, showable_current_password]);

  const sectionBody = useMemo(() => {
    switch (selectedTab) {
      case 0:
        return (accessSlice.isAdmin || accessSlice.userAccess?.includes(UserAccessNameGET)) && (
          <GeneralInfo UserAccessName={UserAccessNamePUT}
                       usersList={usersList}
                       url={general_url}
                       closeModal={closeModal}
                       update={update} />
        );
      case 1:
        return hasAccessChangePassword && (
          <PasswordInfo UserAccessName={UserAccessNamePassword}
                        user_id={usersList.id}
                        url={password_url}
                        closeModal={closeModal}
                        showable_current_password={showable_current_password} />
        );
    }
  }, [accessSlice.isAdmin, accessSlice.userAccess, closeModal, general_url, hasAccessChangePassword, password_url, selectedTab, showable_current_password, update, usersList]);

  const tabsValues = useMemo(() => {
    let array = [];

    if (accessSlice.isAdmin || accessSlice.userAccess?.includes(UserAccessNameGET))
      array.push(giveText(127));

    if (hasAccessChangePassword)
      array.push(giveText(128));

    return array;
  }, [accessSlice.isAdmin, accessSlice.userAccess, hasAccessChangePassword]);

  if (errorGetAllUsers) {
    return <Text>{giveText(24)}</Text>;
  }

  if (isLoadingListAllUsers) {
    return (
      <HStack>
        <Text>{giveText(88)}...</Text>
        <Spinner color={'blue.500'} />
      </HStack>
    );
  }

  return (
    <Box w={'100%'} h={'740px'} px={4} py={6}>
      <Center>
        <Text cursor={'default'} fontWeight={'500'} fontSize={'22px'}>
          {giveText(390)}
        </Text>
      </Center>

      <Separator borderColor={colorMode === 'light' ? 'black' : 'white'} mb={2} mt={2} />

      <SideTabs tabsValues={tabsValues}
                setSelectedTab={setSelectedTab}
                selectedTab={selectedTab}
                sectionBody={sectionBody} />
    </Box>
  );
}
