import { GridItem, SimpleGrid, Stack } from '@chakra-ui/react';
import { motion } from 'motion/react';
import {
  GET_ACTIVE_USERS,
  GET_TOP_TEN_USERS,
  GET_SUM_USED_WALLET,
  GET_SUM_USER_WALLETS,
  GET_SUM_CHARGED_WALLET,
  GET_ACTIVE_SERVICE_COUNT,
  GET_ORGANIZATION_USERS_COUNT,
  GET_COUNT_ACTIVE_ORGANIZATIONS,
} from '../../../Base/UserAccessNames.jsx';
import { useSelector } from 'react-redux';
import { ActiveUsers } from './Sections/ActiveUsers.jsx';
import { ActiveServices } from './Sections/ActiveServices.jsx';
import { UsersServicesInOrganizations } from './Sections/UsersServicesInOrganizations.jsx';
import { SumUsedWallet } from './Sections/SumUsedWallet.jsx';
import { SumChargedWallet } from './Sections/SumChargedWallet.jsx';
import { SumOfUsersWallet } from './Sections/SumOfUsersWallet.jsx';
import { TopTenUsersTable } from './Sections/TopTenUsersTable.jsx';
import { ActiveOrganizations } from './Sections/ActiveOrganizations.jsx';
import { ShowOnViewElement } from '../../../Base/CustomComponets/ShowOnViewElement.jsx';

export default function Dashboard() {
  const accessSlice = useSelector(state => state.accessSlice);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Stack overflowX={'hidden'} height={'92dvh'} overflowY={'auto'} p={3} gap={2}>
        <SimpleGrid columns={[1, 2, 3, 4, 4, 6, 6]} gap={3}>
          {(accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ACTIVE_USERS)) &&
            <ShowOnViewElement>
              <ActiveUsers />
            </ShowOnViewElement>
          }
          {(accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_COUNT_ACTIVE_ORGANIZATIONS)) &&
            <ShowOnViewElement>
              <ActiveOrganizations />
            </ShowOnViewElement>
          }
          {(accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ACTIVE_SERVICE_COUNT)) &&
            <ShowOnViewElement>
              <ActiveServices />
            </ShowOnViewElement>
          }
          {(accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_SUM_USED_WALLET)) &&
            <ShowOnViewElement>
              <SumUsedWallet />
            </ShowOnViewElement>
          }
          {(accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_SUM_USER_WALLETS)) &&
            <ShowOnViewElement>
              <SumOfUsersWallet />
            </ShowOnViewElement>
          }
          {(accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_SUM_CHARGED_WALLET)) &&
            <ShowOnViewElement>
              <SumChargedWallet />
            </ShowOnViewElement>
          }
        </SimpleGrid>

        <SimpleGrid columns={[1, 6]} gap={2}>
          <GridItem colSpan={[1,4]}>
            {(accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ORGANIZATION_USERS_COUNT)) &&
              <ShowOnViewElement>
                <UsersServicesInOrganizations barHeight={'59dvh'} />
              </ShowOnViewElement>
            }
          </GridItem>

          <GridItem colSpan={[1,2]}>
            {(accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_TOP_TEN_USERS)) &&
              <ShowOnViewElement>
                <TopTenUsersTable height={'68.5dvh'} scrollHeight={'61dvh'} />
              </ShowOnViewElement>
            }
          </GridItem>
        </SimpleGrid>
      </Stack>
    </motion.div>
  );
};
