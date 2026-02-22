import { HStack, Text, Stack } from '@chakra-ui/react';
import { MENU_BACKGROUND_DARK, MENU_BACKGROUND_DARK_HOVER } from '../../BaseColor.jsx';
import { giveDir, giveText } from '../../MultiLanguages/HandleLanguage.jsx';
import { IsSuspendTag } from '../../Extensions.jsx';
import { useQuery } from '@tanstack/react-query';
import { fetchWithAxios } from '../../axios/FetchAxios.jsx';
import {
  showToast,
  promiseToast,
  commaForEvery3Digit,
  numberToLetterMethods,
  updatePromiseToastError,
  checkStatus,
  updatePromiseToastSuccessWarningInfo,
} from '../../BaseFunction.jsx';
import { useDispatch, useSelector } from 'react-redux';
import './card.css';
import { Card } from './Card.jsx';
import { setAmount } from '../../../../store/features/walletSlice.jsx';
import { lazy, memo, Suspense, useCallback, useState } from 'react';
import { GET_TRANSACTION, PUT_CHARGE_WALLET } from '../../UserAccessNames.jsx';
import { setHasUpdatedWalletManagementTable } from '../../../../store/features/updatedSlice.jsx';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from '../../../ui/popover.jsx';
import { DialogBody, DialogContent, DialogRoot } from '../../../ui/dialog.jsx';
import { WalletIcon } from '../../CustomIcons/WalletIcon.jsx';
import { TransactionIcon } from '../../CustomIcons/TransactionIcon.jsx';

const MyTransactions = lazy(() => import('./MyTransactions'));
const IncreaseBalance = lazy(() => import('./IncreaseBalance'));

export const Wallet = memo(function Wallet({ name }) {
  const accessSlice = useSelector(state => state.accessSlice);
  const updatedSlice = useSelector(state => state.updatedSlice);
  const [isOpenWallet, setIsOpenWallet] = useState(false);
  const [isOpenIncreaseBalance, setIsOpenIncreaseBalance] = useState(false);
  const [isOpenMyTransaction, setIsOpenMyTransaction] = useState(false);
  const dispatch = useDispatch();

  const updated = useCallback(() => {
    dispatch(setHasUpdatedWalletManagementTable(!updatedSlice.hasUpdatedWalletManagementTable));
  }, [updatedSlice.hasUpdatedWalletManagementTable]);

  const getWallet = async () => {
    try {
      const response = await fetchWithAxios.get('/wallet');
      const data = response.data;
      dispatch(setAmount(data.amount));

      return {
        wallet_number: data.wallet_number.toString().split('-'),
        amount: data.amount,
        wallet_id: data.wallet_id,
        name: name,
        suspend: data.suspend,
      };
    } catch (error) {
      throw error;
    }
  };

  const { data } = useQuery({
    queryKey: ['get_wallet', updatedSlice.hasUpdatedWalletManagementTable],
    queryFn: getWallet,
    refetchOnWindowFocus: false,
  });

  const chargeWalletAxios = ({ value }) => {
    if (!accessSlice.isAdmin && !accessSlice.userAccess?.includes(PUT_CHARGE_WALLET)) {
      showToast({
        title: giveText(30),
        description: giveText(97),
        status: 2,
      });

    } else if (numberToLetterMethods(value)) {
      showToast({
        title: giveText(30),
        description: giveText(188),
        status: 2,
      });
    } else {
      const toastId = promiseToast();

      fetchWithAxios.put('/charge_wallet', { amount: value })
        .then((response) => {
          if (checkStatus({ status: response.data.status })) {
            setIsOpenIncreaseBalance(false);
          }
          updated();
          updatePromiseToastSuccessWarningInfo({ toastId, response });

        })
        .catch((error) => {
          updatePromiseToastError({ toastId, error });
        });
    }
  };

  return <>
    <PopoverRoot lazyMount open={isOpenWallet} onOpenChange={(e) => setIsOpenWallet(e.open)}>
      <PopoverTrigger asChild>
        <HStack spacing={2}
                cursor={'pointer'}
                h={'38px'}
                color={'white'}
                borderRadius={'50px'}
                borderWidth={1}
                className={'box_shadow'}
                borderColor={'#616161'}
                px={3}>

          <Text dir={'ltr'} fontSize={'16px'}>
            ریال
          </Text>
          <Text dir={'ltr'} fontSize={'16px'}>
            {commaForEvery3Digit(data?.amount)}
          </Text>

          <WalletIcon width={'1rem'} />
        </HStack>
      </PopoverTrigger>

      <PopoverContent pb={3} pt={1} w={'420px'} dir={giveDir()} backgroundColor={MENU_BACKGROUND_DARK} color={'white'}>
        <PopoverBody>
          <Stack gap={1}>
            <Card data={data} suspended={data?.suspend} />

            {(accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_CHARGE_WALLET)) &&
              <HStack cursor={data?.suspend ? 'default' : 'pointer'}
                      _hover={{ backgroundColor: MENU_BACKGROUND_DARK_HOVER, borderRadius: 5 }}
                      onClick={() => {
                        if (!data?.suspend) {
                          setIsOpenIncreaseBalance(true);
                          setIsOpenWallet(false);
                        }
                      }}
                      py={1} px={3}>
                <WalletIcon width={'1rem'} />
                <Text pt={'2px'}>{giveText(186)}</Text>

                {data?.suspend && <IsSuspendTag />}
              </HStack>
            }

            {(accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_TRANSACTION)) &&
              <HStack cursor={'pointer'}
                      _hover={{ backgroundColor: MENU_BACKGROUND_DARK_HOVER, borderRadius: 5 }}
                      onClick={() => {
                        setIsOpenWallet(false);
                        setIsOpenMyTransaction(true);
                      }}
                      py={1} px={3}>
                <TransactionIcon width={'1rem'} />
                <Text pt={'2px'}>{giveText(206)}</Text>
              </HStack>
            }
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>

    <DialogRoot lazyMount
                placement={'center'}
                size={'sm'}
                open={isOpenIncreaseBalance}
                onOpenChange={(e) => setIsOpenIncreaseBalance(e.open)}>
      <DialogContent>
        <DialogBody px={4} py={4}>
          <Suspense fallback={'loading...'}>
            <IncreaseBalance data={[data]} chargeWalletAxios={chargeWalletAxios} />
          </Suspense>
        </DialogBody>
      </DialogContent>
    </DialogRoot>

    <DialogRoot lazyMount
                placement={'center'}
                open={isOpenMyTransaction}
                onOpenChange={(e) => setIsOpenMyTransaction(e.open)}>
      <DialogContent maxW={'72rem'} px={2} py={5}>
        <DialogBody>
          <Suspense fallback={'loading...'}>
            <MyTransactions />
          </Suspense>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  </>;
});
