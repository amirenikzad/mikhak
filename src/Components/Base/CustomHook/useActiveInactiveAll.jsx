import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Center, Grid, GridItem, HStack, Separator, Stack, Text } from '@chakra-ui/react';
import { giveDir, giveText } from '../MultiLanguages/HandleLanguage.jsx';
import { promiseToast, updatePromiseToastError, updatePromiseToastSuccessWarningInfo } from '../BaseFunction.jsx';
import { fetchWithAxios } from '../axios/FetchAxios.jsx';
import { useMemo, useState } from 'react';
import { useColorMode } from '../../ui/color-mode.jsx';
import { AccordionItem, AccordionItemContent, AccordionItemTrigger, AccordionRoot } from '../../ui/accordion.jsx';
import { Switch } from '../../ui/switch.jsx';
import { PopoverArrow, PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from '../../ui/popover.jsx';

export const useActiveInactiveAll = ({
                                       setORCatchAllURL,
                                       setORCatchAllParameter,
                                       setORCatchAllUpdate,
                                       extensionQueryParameter,
                                     }) => {
  const accessSlice = useSelector(state => state.accessSlice);
  const [iWantToSetToAll, setIWantToSetToAll] = useState(true);
  const { colorMode } = useColorMode();
  const [openAcceptMore, setOpenAcceptMore] = useState(false);

  const condition = useMemo(() => {
    return accessSlice.isAdmin || accessSlice.userAccess?.includes(`${setORCatchAllURL}_post`);
  }, [accessSlice.isAdmin, accessSlice.userAccess, setORCatchAllURL]);

  const setORCatchAllAxios = (_id) => {
    if (condition) {
      const toastId = promiseToast();

      fetchWithAxios.post(`${setORCatchAllURL}?${setORCatchAllParameter}=${_id}&active=${iWantToSetToAll}${extensionQueryParameter ? `&${extensionQueryParameter}` : ''}`, {})
        .then((response) => {
          setORCatchAllUpdate();
          setOpenAcceptMore(false);
          updatePromiseToastSuccessWarningInfo({ toastId, response });

        })
        .catch((error) => {
          updatePromiseToastError({ toastId, error });
        });
    }
  };

  const component = ({ id }) => (
    <Box mt={3}>
      <Separator borderColor={colorMode === 'light' ? 'black' : 'white'} />

      <AccordionRoot collapsible>
        <AccordionItem>
          <AccordionItemTrigger my={1} cursor={'pointer'}>
            <Center as="span" flex="1">{giveText(8)}</Center>
          </AccordionItemTrigger>
          <AccordionItemContent pb={4}>
            <Grid templateColumns="repeat(3, 1fr)" gap={1}>
              <GridItem colSpan={2} my={'auto'}>
                <HStack spacing={3}>
                  <Text cursor={'pointer'} my={'auto'} mt={'2px'} onClick={() => setIWantToSetToAll(false)}>
                    {giveText(164)}
                  </Text>

                  <Switch my={'auto'}
                          colorPalette={'green'}
                          checked={iWantToSetToAll}
                          onCheckedChange={({ checked }) => setIWantToSetToAll(checked)}
                          __css={{ 'span.chakra-switch__track:not([data-checked])': { backgroundColor: 'red.400' } }} />

                  <Text cursor={'pointer'} my={'auto'} mt={'2px'} onClick={() => setIWantToSetToAll(true)}>
                    {giveText(163)}
                  </Text>
                </HStack>
              </GridItem>

              <GridItem colSpan={1} my={'auto'} dir={giveDir(true)}>
                <PopoverRoot lazyMount
                             positioning={{ placement: 'bottom' }}
                             open={openAcceptMore}
                             onOpenChange={(e) => setOpenAcceptMore(e.open)}>
                  <PopoverTrigger asChild>
                    <Button colorPalette={'green'}
                            size={'xs'}
                            px={3}>
                      {giveText(162)}
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent w={'420px'} dir={giveDir()}>
                    <PopoverArrow />
                    <PopoverBody px={3} py={4}>
                      <Stack gap={1}>
                        <Text cursor={'default'}>
                          {iWantToSetToAll
                            ? giveText(300)
                            : giveText(298)
                          }
                        </Text>

                        <HStack spacing={1} dir={giveDir(true)}>
                          <Button colorPalette={'cyan'}
                                  size={'xs'}
                                  w={'80px'}
                                  px={3}
                                  onClick={() => {
                                    setORCatchAllAxios(id);
                                  }}>
                            {giveText(299)}
                          </Button>

                          <Button colorPalette={'red'}
                                  size={'xs'}
                                  w={'80px'}
                                  px={3}
                                  onClick={() => {
                                    setOpenAcceptMore(false);
                                  }}>
                            {giveText(31)}
                          </Button>
                        </HStack>
                      </Stack>
                    </PopoverBody>
                  </PopoverContent>
                </PopoverRoot>
              </GridItem>
            </Grid>
          </AccordionItemContent>
        </AccordionItem>
      </AccordionRoot>
    </Box>
  );

  return { More: condition ? component : null };
};
