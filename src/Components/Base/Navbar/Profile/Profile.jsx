import { HStack, Stack, Text } from '@chakra-ui/react';
import { MENU_BACKGROUND_DARK, MENU_BACKGROUND_DARK_HOVER } from '../../BaseColor.jsx';
import { logoutAxios } from '../../BaseFunction.jsx';
import { giveDir, giveText } from '../../MultiLanguages/HandleLanguage.jsx';
import {
  PUT_PASSWORD,
  GET_LOGIN_HISTORY,
  PUT_PASSWORD_ADMIN,
  GET_LOGGED_USER_INFO,
  PUT_LOGGED_USER_INFO,
} from '../../UserAccessNames.jsx';
import { useSelector } from 'react-redux';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from '../../../ui/popover.jsx';
import { DialogBody, DialogContent, DialogRoot } from '../../../ui/dialog.jsx';
import { lazy, Suspense, useState } from 'react';
import { Avatar } from '../../../ui/avatar.jsx';
import { ChevronDownOutlineIcon } from '../../CustomIcons/ChevronDownOutlineIcon.jsx';
import { ProfileIcon } from '../../CustomIcons/ProfileIcon.jsx';
import { ExitIcon } from '../../CustomIcons/ExitIcon.jsx';
import { HistoryIcon } from '../../CustomIcons/HistoryIcon.jsx';

const UserInfo = lazy(() => import('../../../Authorization/UserInfo/UserInfo.jsx'));
const LastLoginInfo = lazy(() => import('./LastLoginInfo.jsx'));

export const Profile = ({ usersList = {}, isLoadingListAllUsers, errorGetAllUsers }) => {
  const accessSlice = useSelector(state => state.accessSlice);
  const [isOpenProfilePopover, setIsOpenProfilePopover] = useState(false);
  const [isOpenProfile, setIsOpenProfile] = useState(false);
  const [isOpenLastLoginInfo, setIsOpenLastLoginInfo] = useState(false);

  return <>
    <PopoverRoot lazyMount open={isOpenProfilePopover} onOpenChange={(e) => setIsOpenProfilePopover(e.open)}>
      <PopoverTrigger asChild
                      backgroundColor={'transparent'}
                      cursor={'pointer'}
                      _hover={{ backgroundColor: 'transparent' }}
                      borderRadius={'18px'}>
        <HStack spacing={2}
                color={'white'}
                borderRadius={'100%'}
                borderWidth={1}
                borderColor={'#616161'}
                style={{
                  paddingLeft: giveDir() === 'ltr' ? 0 : 7,
                  paddingRight: giveDir() === 'rtl' ? 0 : 7,
                }}>
          <Avatar css={{ width: '35px', height: '35px' }}
                  name={`${usersList?.name} ${usersList?.family}`}
                  alt={`${usersList?.name} ${usersList?.family}`}
                  src={usersList?.profile_pic && usersList?.profile_pic} />

          <HStack>
            <Text dir={'ltr'} fontSize={'16px'} mt={1}>
              {usersList?.name} {usersList?.family}
            </Text>

            <ChevronDownOutlineIcon width={'1rem'} />
          </HStack>
        </HStack>
      </PopoverTrigger>

      <PopoverContent p={1} w={'200px'} dir={giveDir()} backgroundColor={MENU_BACKGROUND_DARK} color={'white'}>
        <PopoverBody>
          <Stack gap={1} px={2}>
            {(accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_LOGGED_USER_INFO) || accessSlice.userAccess?.includes(PUT_PASSWORD)) &&
              <HStack cursor={'pointer'}
                      py={1}
                      _hover={{ backgroundColor: MENU_BACKGROUND_DARK_HOVER, borderRadius: 5 }}
                      onClick={() => {
                        setIsOpenProfile(true);
                        setIsOpenProfilePopover(false);
                      }}>
                <ProfileIcon width={'1.1rem'} />
                <Text>{giveText(11)}</Text>
              </HStack>
            }

            {(accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_LOGIN_HISTORY)) &&
              <HStack cursor={'pointer'}
                      py={1}
                      _hover={{ backgroundColor: MENU_BACKGROUND_DARK_HOVER, borderRadius: 5 }}
                      onClick={() => {
                        setIsOpenLastLoginInfo(true);
                        setIsOpenProfilePopover(false);
                      }}>
                <HistoryIcon width={'1.1rem'} />
                <Text>{giveText(401)}</Text>
              </HStack>
            }

            <HStack cursor={'pointer'}
                    py={1}
                    _hover={{ backgroundColor: MENU_BACKGROUND_DARK_HOVER, borderRadius: 5 }}
                    onClick={() => {
                      setIsOpenProfilePopover(false);
                      logoutAxios();
                    }}>
              <ExitIcon width={'1.1rem'} />
              <Text>{giveText(69)}</Text>
            </HStack>
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>

    <DialogRoot lazyMount
                placement={'center'}
                size={'xl'}
                open={isOpenProfile}
                onOpenChange={(e) => setIsOpenProfile(e.open)}>
      <DialogContent>
        <DialogBody>
          <Suspense fallback={'loading...'}>
            <UserInfo usersList={usersList}
                      backNone={true}
                      errorGetAllUsers={errorGetAllUsers}
                      isLoadingListAllUsers={isLoadingListAllUsers}
                      showIsAdmin={false}
                      showActive={false}
                      closeModal={() => setIsOpenProfile(false)}
                      general_url={'/user_info'}
                      password_url={'/password'}
                      UserAccessNamePUT={PUT_LOGGED_USER_INFO}
                      UserAccessNameGET={GET_LOGGED_USER_INFO}
                      UserAccessNamePassword={PUT_PASSWORD_ADMIN} />
          </Suspense>
        </DialogBody>
      </DialogContent>
    </DialogRoot>

    <DialogRoot lazyMount
                placement={'center'}
                open={isOpenLastLoginInfo}
                onOpenChange={(e) => setIsOpenLastLoginInfo(e.open)}>
      <DialogContent minW={'70rem'}>
        <DialogBody>
          <Suspense fallback={'loading...'}>
            <LastLoginInfo />
          </Suspense>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  </>;
};
