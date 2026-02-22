import { HStack, Separator, Stack, Text } from '@chakra-ui/react';
import { motion } from 'motion/react';
import { Base } from '../../../../../Authentication/Base.jsx';
import { giveDir, giveText } from '../../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { lazy, Suspense, useCallback, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useActiveInactiveAll } from '../../../../../Base/CustomHook/useActiveInactiveAll.jsx';
import {
  POST_SERVICE_USER_ORGANIZATION,
  DELETE_SERVICE_USER_ORGANIZATION,
} from '../../../../../Base/UserAccessNames.jsx';
import { useSelector } from 'react-redux';
import { SideTabs } from '../../../../../Base/SideTabs.jsx';
import { fetchWithAxios } from '../../../../../Base/axios/FetchAxios.jsx';
import {
  promiseToast,
  updatePromiseToastError,
  checkStatus,
  updatePromiseToastSuccessWarningInfo,
} from '../../../../../Base/BaseFunction.jsx';
import { useColorMode } from '../../../../../ui/color-mode.jsx';
import { User } from '../../../../../Base/Extensions.jsx';

const OrganizationTableTab = lazy(() => import('./Organization/OrganizationTableTab'));
const UserTableTab = lazy(() => import('./User/UserTableTab'));

export default function EditServiceUserOrganization({ selectedCategory = {} }) {
  const { colorMode } = useColorMode();
  const [selectedTab, setSelectedTab] = useState(0);
  const accessSlice = useSelector(state => state.accessSlice);
  const reactQueryItemNameCategoryComponent = useMemo(() => 'all_category_component_list', []);
  const reactQueryItemNameCategoryApi = useMemo(() => 'all_category_api_list', []);
  const setORCatchAllCategoryAPIURL = useMemo(() => '/set_unset_service_user_organization', []);
  const setORCatchAllCategoryComponentURL = useMemo(() => '/set_unset_service_user_organization', []);
  const queryClient = useQueryClient();

  const { More: MoreCategoryComponent } = useActiveInactiveAll({
    setORCatchAllURL: setORCatchAllCategoryComponentURL,
    setORCatchAllParameter: 'service_id',
    extensionQueryParameter: `type=user`,
    setORCatchAllUpdate: () => queryClient.invalidateQueries({ queryKey: [reactQueryItemNameCategoryComponent] }).then(() => null),
  });

  const { More: MoreCategoryAPI } = useActiveInactiveAll({
    setORCatchAllURL: setORCatchAllCategoryAPIURL,
    setORCatchAllParameter: 'service_id',
    extensionQueryParameter: `type=organization`,
    setORCatchAllUpdate: () => queryClient.invalidateQueries({ queryKey: [reactQueryItemNameCategoryApi] }).then(() => null),
  });

  const addServiceUserOrganizationAxios = useCallback(({
                                                         reactQueryItemName,
                                                         setIsLoadingSwitches,
                                                         organization_id,
                                                         user_id,
                                                         index,
                                                       }) => {
    if (accessSlice.isAdmin || accessSlice.userAccess?.includes(POST_SERVICE_USER_ORGANIZATION)) {
      const toastId = promiseToast();
      setIsLoadingSwitches((prevState) => [...prevState, index]);

      fetchWithAxios.post(`/service_user_organization?service_id=${selectedCategory.id}${organization_id ? `&organization_id=${organization_id}` : ''}${user_id ? `&user_id=${user_id}` : ''}&type=${organization_id ? 'organization' : 'user'}`, {})
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
  }, [accessSlice.isAdmin, accessSlice.userAccess, selectedCategory.id]);

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
            <Stack spacing={0}>
              <OrganizationTableTab service_id={selectedCategory.id}
                                    addServiceUserOrganizationAxios={addServiceUserOrganizationAxios}
                                    removeServiceUserOrganizationAxios={removeServiceUserOrganizationAxios}
                                    reactQueryItemName={reactQueryItemNameCategoryApi} />

              {(accessSlice.isAdmin || accessSlice.userAccess?.includes(`${setORCatchAllCategoryAPIURL}_post`)) &&
                MoreCategoryAPI({ id: selectedCategory.id })
              }
            </Stack>
          </Suspense>
        );
      case 1:
        return (
          <Suspense fallback={'loading...'}>
            <Stack spacing={0}>
              <UserTableTab service_id={selectedCategory.id}
                            addServiceUserOrganizationAxios={addServiceUserOrganizationAxios}
                            removeServiceUserOrganizationAxios={removeServiceUserOrganizationAxios}
                            reactQueryItemName={reactQueryItemNameCategoryComponent} />

              {(accessSlice.isAdmin || accessSlice.userAccess?.includes(`${setORCatchAllCategoryComponentURL}_post`)) &&
                MoreCategoryComponent({ id: selectedCategory.id })
              }
            </Stack>
          </Suspense>
        );
    }
  }, [MoreCategoryAPI, MoreCategoryComponent, addServiceUserOrganizationAxios, accessSlice.isAdmin, accessSlice.userAccess, reactQueryItemNameCategoryApi, reactQueryItemNameCategoryComponent, removeServiceUserOrganizationAxios, selectedCategory.id, selectedTab]);

  const tabsValues = useMemo(() => {
    let array = [];
    array.push(giveText(323));
    // array.push(giveText(324));
    return array;
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ height: 'inherit' }}>
      <Base title={giveText(321)}
            hasSubmitButton={false}
            px={0}
            box_shadow={false}
            backNone={true}
            ml={0}
            mr={0}
            Content={
              <Stack spacing={3}>
                <HStack spacing={3}>
                  <Text my={'auto'} fontWeight={'500'} w={'200px'}>{giveText(225)}:</Text>
                  <User dir={'ltr'}
                        userInfo={{
                          username: giveDir() === 'rtl' ? selectedCategory.fa_name : selectedCategory.en_name,
                          profile_pic: colorMode === 'light' ? selectedCategory.light_icon : selectedCategory.dark_icon,
                          email: selectedCategory.email,
                        }} />
                </HStack>

                <Separator borderColor={colorMode === 'light' ? 'black' : 'white'} />

                <SideTabs tabsValues={tabsValues}
                          setSelectedTab={setSelectedTab}
                          selectedTab={selectedTab}
                          sectionBody={sectionBody} />
              </Stack>
            }
      />
    </motion.div>
  );
}
