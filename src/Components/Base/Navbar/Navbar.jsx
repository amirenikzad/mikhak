import { Box, Grid, GridItem, HStack } from '@chakra-ui/react';
import { logoutAxios } from '../BaseFunction';
import { MENU_BACKGROUND_DARK } from '../BaseColor';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Profile } from './Profile/Profile.jsx';
import { giveDir, giveText } from '../MultiLanguages/HandleLanguage';
import { setIsAdmin, setUserAccess } from '../../../store/features/accessSlice.jsx';
import { fetchWithAxios } from '../axios/FetchAxios.jsx';
import { BackDropMessage } from '../BackDropMessage.jsx';
import { Wallet } from './Wallet/Wallet.jsx';
import { News } from './News.jsx';
import { GET_ALL_TICKET, GET_WALLET } from '../UserAccessNames.jsx';
import { Languages } from './Languages.jsx';
import { TicketsNavbar } from './TicketsNavbar.jsx';
import { LogoNavbar } from './LogoNavbar.jsx';
import { BreadcrumbNavbar } from './BreadcrumbNavbar.jsx';

export const Navbar = () => { 
  const accessSlice = useSelector(state => state.accessSlice);
  const updatedSlice = useSelector(state => state.updatedSlice);
  const [usersInfo, setUsersInfo] = useState(null);
  const [showBackdrop, setShowBackdrop] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setUsersInfo(null);
  }, []);

  const userInfoAxios = async () => {
    return await fetchWithAxios.get('/user_info')
      .then((response) => {
        if (response.data.message !== 'access denied') {
          if (response.data[0]?.user_info?.disabled) {
            logoutAxios();
            return;
          }
          setUsersInfo(response.data[0]?.user_info);
          // console.log('User access data:', response.data[0]?.system_user_access);
          dispatch(setUserAccess(response.data[0]?.system_user_access));
        } else {
          dispatch(setUserAccess([]));
        }

        return response.data;
      })
      .catch((error) => {
        setUsersInfo(null);
        throw error;
      });
  };

  const {
    isFetching: isLoadingListAllUsers,
    error: errorGetAllUsers,
  } = useQuery({
    queryKey: ['get_user_info', updatedSlice.hasUpdatedLoginUser],
    queryFn: userInfoAxios,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isLoadingListAllUsers) {
      const timeout = setTimeout(() => setShowBackdrop(true), 1000);
      return () => clearTimeout(timeout);
    } else {
      setShowBackdrop(false);
    }
  }, [isLoadingListAllUsers]);

  useEffect(() => {
    dispatch(setIsAdmin(usersInfo?.admin ? usersInfo?.admin : false));
  }, [usersInfo]);

  return <>
    <BackDropMessage open={showBackdrop} text={giveText(98)} />

    <Box position={'sticky'}
         top={0}
         backgroundColor={MENU_BACKGROUND_DARK}
         dir={giveDir()}
         py={2}
         px={'30px'}
         h={'56px'}
         className={'box_shadow'}
         zIndex={'6 !important'}>
      <Grid templateColumns="repeat(2, 1fr)" gap={1}>
        <GridItem colSpan={1} my={'auto'}>
          <BreadcrumbNavbar />
        </GridItem>

        <GridItem colSpan={1} my={'auto'}>
          <HStack gap={1} dir={giveDir(true)}>
            <LogoNavbar />

            <Profile usersList={usersInfo}
                     isLoadingListAllUsers={isLoadingListAllUsers}
                     errorGetAllUsers={errorGetAllUsers} />

            {(accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_WALLET)) &&
              <Wallet name={`${usersInfo?.name} ${usersInfo?.family}`} />
            }

            <News />

            <Languages color={'white'} hoverColor={'gray.700'} />

            {(accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ALL_TICKET)) &&
              <TicketsNavbar />
            }
          </HStack>
        </GridItem>
      </Grid>
    </Box>
  </>;
};
