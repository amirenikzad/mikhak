import { lazy, Suspense, useCallback, useMemo, useState } from 'react';
import { Stack } from '@chakra-ui/react';
import { motion } from 'motion/react';
import { Base } from '../../../../../Authentication/Base.jsx';
import { useSelector } from 'react-redux';
import { giveText } from '../../../../../Base/MultiLanguages/HandleLanguage.jsx';
import {
  GET_ALL_USER,
  GET_ALL_ORGANIZATION,
  GET_USER_SERVICE_ORGANIZATION,
  GET_ORGANIZATION_SERVICE_USER,
  POST_SERVICE_USER_ORGANIZATION,
  DELETE_SERVICE_USER_ORGANIZATION,
} from '../../../../../Base/UserAccessNames.jsx';
import { useQueryClient } from '@tanstack/react-query';
import { useActiveInactiveAll } from '../../../../../Base/CustomHook/useActiveInactiveAll.jsx';
import { SideTabs } from '../../../../../Base/SideTabs.jsx';
import {
  promiseToast,
  updatePromiseToastError,
  checkStatus,
  updatePromiseToastSuccessWarningInfo,
} from '../../../../../Base/BaseFunction.jsx';
import { fetchWithAxios } from '../../../../../Base/axios/FetchAxios.jsx';

const OrganizationSelect = lazy(() => import('./Organization/OrganizationSelect'));
const OrganizationServicesTableTab = lazy(() => import('./Organization/OrganizationServicesTableTab'));
const UsersSelect = lazy(() => import('./User/UsersSelect'));
const UserServicesTableTab = lazy(() => import('./User/UserServicesTableTab'));

export default function AdvancedServiceOrganization() {
  const accessSlice = useSelector(state => state.accessSlice);
  const [selectedTab, setSelectedTab] = useState(accessSlice.isAdmin || (accessSlice.userAccess?.includes(GET_ALL_ORGANIZATION) && accessSlice.userAccess?.includes(GET_ORGANIZATION_SERVICE_USER)) ? 0 : 1);
  const [selectedOrganization, setSelectedOrganization] = useState({});
  const [selectedUser, setSelectedUser] = useState({});
  const reactQueryItemNameComponentCategory = useMemo(() => 'all_user_service_list', []);
  const reactQueryItemNameApiCategory = useMemo(() => 'all_organization_service_list', []);
  const setORCatchAllCategoryAPIURL = useMemo(() => '/set_unset_user_service_organization', []);
  const setORCatchAllCategoryComponentURL = useMemo(() => '/set_unset_user_service_organization', []);
  const queryClient = useQueryClient();

  const { More: MoreCategoryComponent } = useActiveInactiveAll({
    setORCatchAllURL: setORCatchAllCategoryComponentURL,
    setORCatchAllParameter: 'id',
    extensionQueryParameter: `type=user`,
    setORCatchAllUpdate: () => queryClient.invalidateQueries({ queryKey: [reactQueryItemNameComponentCategory] }).then(() => null),
  });

  const { More: MoreCategoryAPI } = useActiveInactiveAll({
    setORCatchAllURL: setORCatchAllCategoryAPIURL,
    setORCatchAllParameter: 'id',
    extensionQueryParameter: `type=organization`,
    setORCatchAllUpdate: () => queryClient.invalidateQueries({ queryKey: [reactQueryItemNameApiCategory] }).then(() => null),
  });

  const addServiceUserOrganizationAxios = useCallback(({
                                                         reactQueryItemName,
                                                         setIsLoadingSwitches,
                                                         service_id,
                                                         index,
                                                       }) => {
    if (accessSlice.isAdmin || accessSlice.userAccess?.includes(POST_SERVICE_USER_ORGANIZATION)) {
      const toastId = promiseToast();
      setIsLoadingSwitches((prevState) => [...prevState, index]);

      fetchWithAxios.post(`/service_user_organization?service_id=${service_id}${selectedOrganization?.id ? `&organization_id=${selectedOrganization.id}` : ''}${selectedUser?.id ? `&user_id=${selectedUser.id}` : ''}&type=${selectedOrganization?.id ? 'organization' : 'user'}`, {})
        .then((response) => {
          if (checkStatus({ status: response.data.status })) {
            queryClient.invalidateQueries({ queryKey: [reactQueryItemName] }).then(() => null);
            setTimeout(() => {
              setIsLoadingSwitches((prevState) => prevState.filter(num => num !== index));
            }, 1000);
          }
          updatePromiseToastSuccessWarningInfo({ toastId, response });

        })
        .catch((error) => {
          updatePromiseToastError({ toastId, error });
        });
    }
  }, [accessSlice.isAdmin, accessSlice.userAccess, selectedOrganization.id, selectedUser.id]);

  const removeServiceUserOrganizationAxios = useCallback(({
                                                            reactQueryItemName,
                                                            service_user_organization_id,
                                                            index,
                                                            setIsLoadingSwitches,
                                                          }) => {
    if (accessSlice.isAdmin || accessSlice.userAccess?.includes(DELETE_SERVICE_USER_ORGANIZATION)) {
      const toastId = promiseToast();
      setIsLoadingSwitches((prevState) => [...prevState, index]);

      fetchWithAxios.delete(`/service_user_organization?id=${service_user_organization_id}`)
        .then((response) => {
          if (checkStatus({ status: response.data.status })) {
            queryClient.invalidateQueries({ queryKey: [reactQueryItemName] }).then(() => null);
            setTimeout(() => {
              setIsLoadingSwitches((prevState) => prevState.filter(num => num !== index));
            }, 1000);
          }
          updatePromiseToastSuccessWarningInfo({ toastId, response });

        })
        .catch((error) => {
          updatePromiseToastError({ toastId, error });
        });
    }
  }, [accessSlice.isAdmin, accessSlice.userAccess]);

  const sectionBody = useMemo(() => {
    switch (selectedTab) {
      case 0:
        return (
          <Suspense fallback={'loading...'}>
            <Stack spacing={1}>
              <OrganizationSelect setSelectedOrganization={setSelectedOrganization} />

              <OrganizationServicesTableTab org_id={selectedOrganization.id}
                                            addServiceUserOrganizationAxios={addServiceUserOrganizationAxios}
                                            removeServiceUserOrganizationAxios={removeServiceUserOrganizationAxios}
                                            reactQueryItemName={reactQueryItemNameApiCategory} />

              {(accessSlice.isAdmin || accessSlice.userAccess?.includes(`${setORCatchAllCategoryAPIURL}_post`)) &&
                selectedOrganization.id && MoreCategoryAPI({ id: selectedOrganization.id })
              }
            </Stack>
          </Suspense>
        );
      case 1:
        return (
          <Suspense fallback={'loading...'}>
            <Stack spacing={1}>
              <UsersSelect setSelectedUser={setSelectedUser} />

              <UserServicesTableTab user_id={selectedUser.id}
                                    addServiceUserOrganizationAxios={addServiceUserOrganizationAxios}
                                    removeServiceUserOrganizationAxios={removeServiceUserOrganizationAxios}
                                    reactQueryItemName={reactQueryItemNameComponentCategory} />

              {(accessSlice.isAdmin || accessSlice.userAccess?.includes(`${setORCatchAllCategoryComponentURL}_post`)) &&
                selectedUser.id && MoreCategoryComponent({ id: selectedUser.id })
              }
            </Stack>
          </Suspense>
        );
    }
  }, [MoreCategoryAPI, MoreCategoryComponent, accessSlice.isAdmin, accessSlice.userAccess, addServiceUserOrganizationAxios, reactQueryItemNameApiCategory, reactQueryItemNameComponentCategory, removeServiceUserOrganizationAxios, selectedOrganization.id, selectedUser.id, selectedTab, setORCatchAllCategoryComponentURL, setORCatchAllCategoryAPIURL]);

  const tabsValues = useMemo(() => {
    let array = [];

    if (accessSlice.isAdmin || (accessSlice.userAccess?.includes(GET_ALL_ORGANIZATION) && accessSlice.userAccess?.includes(GET_ORGANIZATION_SERVICE_USER)))
      array.push(giveText(325));
    else
      array.push('');

    // if (accessSlice.isAdmin || (accessSlice.userAccess?.includes(GET_ALL_USER) && accessSlice.userAccess?.includes(GET_USER_SERVICE_ORGANIZATION)))
    //   array.push(giveText(326));
    // else
    //   array.push('');

    return array;
  }, [accessSlice.isAdmin, accessSlice.userAccess]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ height: 'inherit' }}>
      <Base title={giveText(102)}
            hasSubmitButton={false}
            backNone={true}
            box_shadow={false}
            px={'0'}
            mr={0}
            ml={0}
            Content={
              <SideTabs tabsValues={tabsValues}
                        setSelectedTab={setSelectedTab}
                        selectedTab={selectedTab}
                        sectionBody={sectionBody}
                         />
            } 
            />
    </motion.div>
  );
};
