import { Box, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import {
  ROLE_NAME,
  SERVICE_NAME,
  SETTINGS_NAME,
  PLATFORM_NAME,
  PANEL_NAME,
  DASHBOARD_NAME,
  USER_ROLE_NAME,
  GIFT_CARD_NAME,
  PERMISSION_NAME,
  TRANSACTION_NAME,
  ORGANIZATION_NAME,
  USERS_WALLET_NAME,
  FUNCTIONALITY_NAME,
  ROLE_PERMISSION_NAME,
  USER_MANAGEMENT_NAME,
  ORGANIZATION_USER_NAME,
  SERVICE_USER_ORGANIZATION_NAME,
  DEVOPS_NAME,
  USER_INFO_NAME,
  CATEGORY_NAME,
  EDITION_NAME,
  Tree_NAME
} from '../PageNames.jsx';
import {
  ROLE_ROUTE,
  ADMIN_ROUTE,
  SERVICE_ROUTE,
  SETTINGS_ROUTE,
  PLATFORM_ROUTE,
  PANEL_ROUTE,
  USER_ROLE_ROUTE,
  DASHBOARD_ROUTE,
  GIFT_CARD_ROUTE,
  PERMISSION_ROUTE,
  TRANSACTION_ROUTE,
  ORGANIZATION_ROUTE,
  USERS_WALLET_ROUTE,
  FUNCTIONALITY_ROUTE,
  ROLE_PERMISSION_ROUTE,
  USER_MANAGEMENT_ROUTE,
  ORGANIZATION_USER_ROUTE,
  SERVICE_USER_ORGANIZATION_ROUTE,
  DEVOPS_ROUTE,
  USER_INFO_ROUTE,
  CATEGORY_ROUTE,
  EDITION_ROUTE,
  TREE_ROUTE,
} from '../BaseRouts.jsx';
import { giveDir, giveText } from '../MultiLanguages/HandleLanguage.jsx';
import {
  GET_ALL_USER,
  GET_ALL_ROLES,
  GET_ALL_SERVICES,
  GET_ALL_USER_ROLE,
  GET_ALL_GIFT_CARD,
  GET_ALL_PERMISSIONS,
  GET_ALL_ORGANIZATION,
  GET_ALL_USERS_WALLET,
  GET_ALL_FUNCTIONALITIES,
  GET_ALL_ROLES_PERMISSIONS,
  GET_ALL_ORGANIZATION_USER,
  GET_TRANSACTION_USERS_WALLET,
  GET_ALL_SERVICE_USER_ORGANIZATION,
} from '../UserAccessNames.jsx';
import { ExpandMenu } from './ExpandMenu.jsx';
import { CollapseMenu } from './CollapseMenu.jsx';
import { HomeIcon } from '../CustomIcons/HomeIcon.jsx';
import { ShieldCheckIcon } from '../CustomIcons/ShieldCheckIcon.jsx';
import { WalletIcon } from '../CustomIcons/WalletIcon.jsx';
import { SettingsIcon } from '../CustomIcons/SettingsIcon.jsx';
import { StackIcon } from '../CustomIcons/StackIcon.jsx';
import { CollectionIcon } from '../CustomIcons/CollectionIcon.jsx';
import { BuildingsFillIcon } from '../CustomIcons/BuildingsFillIcon.jsx';
import { UsersIcon } from '../CustomIcons/UsersIcon.jsx';
import { UsersLockIcon } from '../CustomIcons/UsersLockIcon.jsx';
import { DockerIcon } from '../CustomIcons/DockerIcon.jsx';
import { BuildingUserIcon } from '../CustomIcons/BuildingUserIcon.jsx';
import { UserCheckIcon } from '../CustomIcons/UserCheckIcon.jsx';
import { EngineeringIcon } from '../CustomIcons/EngineeringIcon.jsx';
import { UserConfigIcon } from '../CustomIcons/UserConfigIcon.jsx';
import { TransactionIcon } from '../CustomIcons/TransactionIcon.jsx';
import { APIIcon } from '../CustomIcons/APIIcon.jsx';
import { DollarCurrencyIcon } from '../CustomIcons/DollarCurrencyIcon.jsx';
import { GiftIcon } from '../CustomIcons/GiftIcon.jsx';
import { HistoryIcon } from '../CustomIcons/HistoryIcon.jsx';
import { PlatformIcon } from '../CustomIcons/PlatformIcon.jsx';
import { CategoryIcon3 } from '../CustomIcons/CategoryIcon3.jsx';
import { EditionIcon } from '../CustomIcons/EditionIcon.jsx';
import { CartableServiceIcon } from '../CustomIcons/CartableServiceIcon.jsx';
import { UsersManagementIcon } from '../CustomIcons/UsersManagementIcon.jsx';
import { TopSideMenu } from './Sections/TopSideMenu.jsx';
import { HamburgerMenu } from './Sections/HamburgerMenu.jsx';
import { BottomSideMenu } from './Sections/BottomSideMenu.jsx';
import { TreeIcon } from '../CustomIcons/TreeIcon.jsx';
import { PanelIcon } from '../CustomIcons/PanelIcon.jsx';

export const SideMenu = () => {
  const menuSlice = useSelector(state => state.menuSlice);
  const accessSlice = useSelector(state => state.accessSlice);
  const navigate = useNavigate();
  const IndexList = useMemo(() => {
    let base = [{
      title: giveText(77),
      type: 'single',
      method: () => navigate(`${ADMIN_ROUTE}${DASHBOARD_ROUTE}`),
      icon: ({ color = 'white', size = '1.6rem' }) => <HomeIcon color={color} width={size} />,
      section: DASHBOARD_NAME,
    }];

    let manageAccessList = [];
    let organizationList = [];
    let projectManagementList = [];
    let financialManagementList = [];
    let userList = [];
    let settingList = [];

    let subAccessArray = [];

    (accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ALL_USER)) && userList.push({
      title: giveText(51),
      type: 'single',
      method: () => navigate(`${ADMIN_ROUTE}${USER_MANAGEMENT_ROUTE}`),
      icon: ({ color = 'white', size = '1.5rem' }) => <UsersManagementIcon color={color} width={size} />,
      section: USER_MANAGEMENT_NAME,
    });
    (accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ALL_USER)) && userList.push({
      title: giveText(427),
      type: 'single',
      method: () => navigate(`${ADMIN_ROUTE}${USER_INFO_ROUTE}`),
      icon: ({ color = 'white', size = '1.5rem' }) => <HistoryIcon color={color} width={size} />,
      section: USER_INFO_NAME,
    });
    if (userList.length) {
      subAccessArray.push(
        {
          title: giveText(13),
          type: 'group',
          icon: ({ color = 'white', size = '1.5rem' }) => <UsersIcon color={color} width={size} />,
          items: userList,
        },
      );
    }

    (accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ALL_ROLES)) && manageAccessList.push({
      title: giveText(44),
      type: 'single',
      method: () => navigate(`${ADMIN_ROUTE}${ROLE_ROUTE}`),
      icon: ({ color = 'white', size = '1.5rem' }) => <EngineeringIcon color={color} width={size} />,
      section: ROLE_NAME,
    });

    (accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ALL_PERMISSIONS)) && manageAccessList.push({
      title: giveText(52),
      type: 'single',
      method: () => navigate(`${ADMIN_ROUTE}${PERMISSION_ROUTE}`),
      icon: ({ color = 'white', size = '1.45rem' }) => <UsersLockIcon color={color} width={size} />,
      section: PERMISSION_NAME,
    });

    (accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ALL_ROLES_PERMISSIONS)) && manageAccessList.push({
      title: giveText(47),
      type: 'single',
      method: () => navigate(`${ADMIN_ROUTE}${ROLE_PERMISSION_ROUTE}`),
      icon: ({ color = 'white', size = '1.6rem' }) => <ShieldCheckIcon color={color} width={size} />,
      section: ROLE_PERMISSION_NAME,
    });

    (accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ALL_USER_ROLE)) && manageAccessList.push({
      title: giveText(49),
      type: 'single',
      method: () => navigate(`${ADMIN_ROUTE}${USER_ROLE_ROUTE}`),
      icon: ({ color = 'white', size = '1.5rem' }) => <UserCheckIcon color={color} width={size} />,
      section: USER_ROLE_NAME,
    });

    (accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ALL_ORGANIZATION)) && organizationList.push({
      title: giveText(131),
      type: 'single',
      method: () => navigate(`${ADMIN_ROUTE}${ORGANIZATION_ROUTE}`),
      icon: ({ color = 'white', size = '1.5rem' }) => <BuildingsFillIcon color={color} width={size} />,
      section: ORGANIZATION_NAME,
    });

    (accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ALL_ORGANIZATION_USER)) && organizationList.push({
      title: giveText(147),
      type: 'single',
      method: () => navigate(`${ADMIN_ROUTE}${ORGANIZATION_USER_ROUTE}`),
      icon: ({ color = 'white', size = '1.5rem' }) => <BuildingUserIcon color={color} width={size} />,
      section: ORGANIZATION_USER_NAME,
    });

    if (manageAccessList.length) {
      subAccessArray.push(
        {
          title: giveText(78),
          type: 'group',
          icon: ({ color = 'white', size = '1.5rem' }) => <UserConfigIcon color={color} width={size} />,
          items: manageAccessList,
        },
      );
    }

    (accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ALL_FUNCTIONALITIES)) && projectManagementList.push({
      title: giveText(103),
      type: 'single',
      method: () => navigate(`${ADMIN_ROUTE}${FUNCTIONALITY_ROUTE}`),
      icon: ({ color = 'white', size = '1.5rem' }) => <APIIcon color={color} width={size} />,
      section: FUNCTIONALITY_NAME,
    });

    (accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ALL_SERVICES)) && projectManagementList.push({
      title: giveText(225),
      type: 'single',
      method: () => navigate(`${ADMIN_ROUTE}${SERVICE_ROUTE}`),
      icon: ({ color = 'white', size = '1.5rem' }) => <DockerIcon color={color} width={size} />,
      section: SERVICE_NAME,
    });

    (accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ALL_SERVICE_USER_ORGANIZATION)) && projectManagementList.push({
      title: giveText(321),
      type: 'single',
      method: () => navigate(`${ADMIN_ROUTE}${SERVICE_USER_ORGANIZATION_ROUTE}`),
      icon: ({ color = 'white', size = '1.2rem' }) => (
        <CollectionIcon color={color}
                        width={size}
                        style={{
                          marginRight: giveDir() === 'ltr' ? 5 : 0,
                          marginLeft: giveDir() === 'rtl' ? 5 : 0,
                        }} />
      ),
      section: SERVICE_USER_ORGANIZATION_NAME,
    });
    (accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ALL_SERVICE_USER_ORGANIZATION)) && projectManagementList.push({
      title: giveText(459),
      type: 'single',
      method: () => navigate(`${ADMIN_ROUTE}${TREE_ROUTE}`),
      icon: ({ color = 'white', size = '1.2rem' }) => (
        <TreeIcon color={color}
                        width={size}
                        style={{
                          marginRight: giveDir() === 'ltr' ? 5 : 0,
                          marginLeft: giveDir() === 'rtl' ? 5 : 0,
                        }} />
      ),
      section: Tree_NAME,
    });

    if (projectManagementList.length) {
      subAccessArray.push(
        {
          title: giveText(224),
          type: 'group',
          icon: ({ color = 'white', size = '1.5rem' }) => <StackIcon color={color} width={size} />,
          items: projectManagementList,
        },
      );
    }

    if (organizationList.length) {
      subAccessArray.push(
        {
          title: giveText(183),
          type: 'group',
          icon: ({ color = 'white', size = '1.5rem' }) => <BuildingsFillIcon color={color} width={size} />,
          items: organizationList,
        },
      );
    }

    (accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ALL_USERS_WALLET)) && financialManagementList.push({
      title: giveText(192),
      type: 'single',
      method: () => navigate(`${ADMIN_ROUTE}${USERS_WALLET_ROUTE}`),
      icon: ({ color = 'white', size = '1.5rem' }) => <WalletIcon color={color} width={size} />,
      section: USERS_WALLET_NAME,
    });

    (accessSlice.isAdmin || (accessSlice.userAccess?.includes(GET_TRANSACTION_USERS_WALLET) && accessSlice.userAccess?.includes(GET_ALL_USER))) && financialManagementList.push({
      title: giveText(197),
      type: 'single',
      method: () => navigate(`${ADMIN_ROUTE}${TRANSACTION_ROUTE}`),
      icon: ({ color = 'white', size = '1.5rem' }) => <TransactionIcon color={color} width={size} />,
      section: TRANSACTION_NAME,
    });

    (accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ALL_GIFT_CARD)) && financialManagementList.push({
      title: giveText(255),
      type: 'single',
      method: () => navigate(`${ADMIN_ROUTE}${GIFT_CARD_ROUTE}`),
      icon: ({ color = 'white', size = '1.5rem' }) => <GiftIcon color={color} width={size} />,
      section: GIFT_CARD_NAME,
    });

    if (financialManagementList.length) {
      subAccessArray.push(
        {
          title: giveText(254),
          type: 'group',
          icon: ({ color = 'white', size = '1.5rem' }) => <DollarCurrencyIcon color={color} width={size} />,
          items: financialManagementList,
        },
      );
    }

    (accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ALL_USER)) && subAccessArray.push({
      title: giveText(417),
      type: 'single',
      method: () => navigate(`${ADMIN_ROUTE}${DEVOPS_ROUTE}`),
      icon: ({ color = 'white', size = '1.5rem' }) => <CartableServiceIcon color={color} width={size} />,
      section: DEVOPS_NAME,
    });

    // subAccessArray.push({
    //   title: giveText(182),
    //   type: 'single',
    //   method: () => navigate(`${ADMIN_ROUTE}${SETTINGS_ROUTE}`),
    //   icon: ({ color = 'white', size = '1.5rem' }) => <SettingsIcon color={color} width={size} />,
    //   section: SETTINGS_NAME,
    // });
    // (accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ALL_USER)) && settingList.push({
    //   title: giveText(182),
    //   type: 'single',
    //   method: () => navigate(`${ADMIN_ROUTE}${SETTINGS_ROUTE}`),
    //   icon: ({ color = 'white', size = '1.5rem' }) => <SettingsIcon color={color} width={size} />,
    //   section: SETTINGS_NAME,
    // });
    (accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ALL_USER)) && settingList.push({
      title: giveText(430),
      type: 'single',
      method: () => navigate(`${ADMIN_ROUTE}${PLATFORM_ROUTE}`),
      icon: ({ color = 'white', size = '1.5rem' }) => <PlatformIcon color={color} width={size} />,
      section: PLATFORM_NAME,
    });

    (accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ALL_USER)) && settingList.push({
      title: giveText(457),
      type: 'single',
      method: () => navigate(`${ADMIN_ROUTE}${PANEL_ROUTE}`),
      icon: ({ color = 'white', size = '1.5rem' }) => <PanelIcon color={color} width={size} />,
      section: PANEL_NAME,
    });

    (accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ALL_USER)) && settingList.push({
      title: giveText(220),
      type: 'single',
      method: () => navigate(`${ADMIN_ROUTE}${CATEGORY_ROUTE}`),
      icon: ({ color = 'white', size = '1.3rem' }) => <CategoryIcon3 color={color} width={size} />,
      section: CATEGORY_NAME,
    });

    (accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ALL_USER)) && settingList.push({
      title: giveText(442),
      type: 'single',
      method: () => navigate(`${ADMIN_ROUTE}${EDITION_ROUTE}`),
      icon: ({ color = 'white', size = '1.5rem' }) => <EditionIcon color={color} width={size} />,
      section: EDITION_NAME,
    });

    if (settingList.length) {
      subAccessArray.push(
        {
          title: giveText(182),
          type: 'group',
          icon: ({ color = 'white', size = '1.5rem' }) => <SettingsIcon color={color} width={size} />,
          items: settingList,
        },
      );
    }

    if (subAccessArray.length) {
      base.push(...subAccessArray);
    }

    return base;
  }, [accessSlice.isAdmin, accessSlice.userAccess]);

  return <>
    <Box position={'relative'} h={'inherit'} dir={'rtl'}>
      <HamburgerMenu />
      <TopSideMenu />

      <VStack spacing={0}>
        <Box dir={'ltr'}
             h={'67dvh'}
             px={menuSlice.is_expanded_menu ? '30px' : null}
             transition={'all 0.3s ease'}
             w={'100%'}
             overflowY={'auto'}>
          {menuSlice.is_expanded_menu ? (
            <>
              <ExpandMenu list={IndexList} />
              <BottomSideMenu hasVersion={true} />
            </>
          ) : (
            <>
              <CollapseMenu list={IndexList} />
              <BottomSideMenu hasVersion={false} />
            </>
          )}
        </Box>
      </VStack>
    </Box>
  </>;
};
