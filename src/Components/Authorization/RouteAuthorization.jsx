import { Route, Routes } from 'react-router';
import {
  ROLE_ROUTE,
  TICKET_ROUTE,
  SERVICE_ROUTE,
  SETTINGS_ROUTE,
  PLATFORM_ROUTE,
  PANEL_ROUTE,
  DASHBOARD_ROUTE,
  USER_ROLE_ROUTE,
  GIFT_CARD_ROUTE,
  PERMISSION_ROUTE,
  TRANSACTION_ROUTE,
  ORGANIZATION_ROUTE,
  USERS_WALLET_ROUTE,
  FUNCTIONALITY_ROUTE,
  USER_MANAGEMENT_ROUTE,
  ROLE_PERMISSION_ROUTE,
  ORGANIZATION_USER_ROUTE,
  SERVICE_USER_ORGANIZATION_ROUTE,
  DEVOPS_ROUTE,
  USER_INFO_ROUTE,
  CATEGORY_ROUTE,
  EDITION_ROUTE
} from '../Base/BaseRouts';
import { Box, Flex } from '@chakra-ui/react';
import { SideMenu } from '../Base/SideMenu/SideMenu.jsx';
import { useSelector } from 'react-redux';
import { MENU_BACKGROUND_DARK, MENU_BACKGROUND_LIGHT } from '../Base/BaseColor';
import { Navbar } from '../Base/Navbar/Navbar.jsx';
import { giveDir } from '../Base/MultiLanguages/HandleLanguage.jsx';
import { useColorMode } from '../ui/color-mode.jsx';
import { lazy, useEffect } from 'react';
import { changeLocation } from '../Base/BaseFunction.jsx';

const DashboardSection = lazy(() => import('./Pages/BaseAccessSections/Dashboard/DashboardSection'));
const UserManagementSection = lazy(() => import('./Pages/BaseAccessSections/UserManagement/UserManagementSection'));
const RoleSection = lazy(() => import('./Pages/BaseAccessSections/ManageAccess/RoleSection'));
const RolePermissionSection = lazy(() => import('./Pages/BaseAccessSections/ManageAccess/RolePermissionSection'));
const OrganizationUserSection = lazy(() => import('./Pages/BaseAccessSections/Organization/OrganizationUserSection'));
const UserWalletManagerSection = lazy(() => import('./Pages/BaseAccessSections/FinancialManagement/UserWalletManagerSection'));
const UsersTransactionsSection = lazy(() => import('./Pages/BaseAccessSections/FinancialManagement/UsersTransactionsSection'));
const Settings = lazy(() => import('./Pages/Settings/Settings'));
const ServiceSection = lazy(() => import('./Pages/BaseAccessSections/ServiceManagement/ServiceSection'));
const GiftCardSection = lazy(() => import('./Pages/BaseAccessSections/FinancialManagement/GiftCardSection'));
const ServiceUserOrganizationSection = lazy(() => import('./Pages/BaseAccessSections/ServiceManagement/ServiceUserOrganizationSection'));
const UserRoleSection = lazy(() => import('./Pages/BaseAccessSections/ManageAccess/UserRoleSection'));
const OrganizationSection = lazy(() => import('./Pages/BaseAccessSections/Organization/OrganizationSection'));
const PermissionSection = lazy(() => import('./Pages/BaseAccessSections/ManageAccess/PermissionSection'));
const FunctionalitySection = lazy(() => import('./Pages/BaseAccessSections/ServiceManagement/FunctionalitySection.jsx'));
const TicketSection = lazy(() => import('./Pages/BaseAccessSections/ServiceManagement/TicketSection'));

const Devops= lazy(() => import('./Pages/Devops/Devops.jsx'));
const UserInfoSection = lazy(() => import('./Pages/BaseAccessSections/UserManagement/UserInfoSection.jsx'));
const Platform = lazy(() => import('./Pages/BaseAccessSections/Setting/PlatformSection.jsx'));
const Panel = lazy(() => import('./Pages/BaseAccessSections/Setting/PanelSection.jsx'));
const Category = lazy(() => import('./Pages/BaseAccessSections/Setting/CategorySection.jsx'));
const Edition = lazy(() => import('./Pages/BaseAccessSections/Setting/EditionSection.jsx'));


export default function RouteAuthorization() {
  const { colorMode } = useColorMode();
  const menuSlice = useSelector(state => state.menuSlice);

  useEffect(() => {
    changeLocation();
  }, []);

  return <>
    <Flex h={'100dvh'}
          overflowY={'auto'}
          dir={giveDir()}
          backgroundColor={colorMode === 'light' ? 'white' : '#1A1F1F'}>
      <Box transition={'width 0.5s'}
           w={menuSlice.is_expanded_menu ? '290px' : '63px'}
           h={'100dvh'}
           zIndex={'7 !important'}
           backgroundColor={colorMode === 'light' ? MENU_BACKGROUND_LIGHT : MENU_BACKGROUND_DARK}
           className={'box_shadow'}
           position={'sticky'}>
        <SideMenu />
      </Box>

      <Box w={menuSlice.is_expanded_menu ? 'calc(100% - 270px)' : 'calc(100% - 63px)'}
           transition={'width 0.5s'}>
        <Navbar />

        <Box zIndex={'6 !important'}>
          <Routes>
            <Route path={DASHBOARD_ROUTE} element={<DashboardSection />} />

            <Route path={USER_MANAGEMENT_ROUTE} element={<UserManagementSection />} />

            <Route path={ROLE_ROUTE} element={<RoleSection />} />
            <Route path={PERMISSION_ROUTE} element={<PermissionSection />} />
            <Route path={ROLE_PERMISSION_ROUTE} element={<RolePermissionSection />} />
            <Route path={USER_ROLE_ROUTE} element={<UserRoleSection />} />

            <Route path={FUNCTIONALITY_ROUTE} element={<FunctionalitySection />} />
            <Route path={SERVICE_ROUTE} element={<ServiceSection />} />
            <Route path={SERVICE_USER_ORGANIZATION_ROUTE} element={<ServiceUserOrganizationSection />} />

            <Route path={ORGANIZATION_ROUTE} element={<OrganizationSection />} />
            <Route path={ORGANIZATION_USER_ROUTE} element={<OrganizationUserSection />} />

            <Route path={USERS_WALLET_ROUTE} element={<UserWalletManagerSection />} />
            <Route path={TRANSACTION_ROUTE} element={<UsersTransactionsSection />} />
            <Route path={GIFT_CARD_ROUTE} element={<GiftCardSection />} />

            <Route path={TICKET_ROUTE} element={<TicketSection />} />

            <Route path={SETTINGS_ROUTE} element={<Settings />} />
            <Route path={PLATFORM_ROUTE} element={<Platform />} />
            <Route path={PANEL_ROUTE} element={<Panel />} />
            <Route path={CATEGORY_ROUTE} element={<Category />} />
            <Route path={EDITION_ROUTE} element={<Edition />} />
            
            <Route path={DEVOPS_ROUTE} element={<Devops />} />
            <Route path={USER_INFO_ROUTE} element={<UserInfoSection />} />
          </Routes>
        </Box>
      </Box>
    </Flex>

    {/*<NewOptionsModal />*/}
  </>;
};
