import { Box, Text, Image, Stack, Button, HStack, Center, Separator, ButtonGroup } from '@chakra-ui/react';
import { giveDir, giveText } from '../../../../../../../Base/MultiLanguages/HandleLanguage.jsx';
import FloatingLabelEditorJs from '../../../../../../../Base/CustomComponets/FloatingLabelEditorJs.jsx';
import {
  showToast,
  promiseToast,
  methodTagIconColor,
  commaForEvery3Digit,
  updatePromiseToastError,
  checkStatus,
  updatePromiseToastSuccessWarningInfo,
} from '../../../../../../../Base/BaseFunction.jsx';
import { POST_SERVICE_COMPONENT_MICROSERVICE } from '../../../../../../../Base/UserAccessNames.jsx';
import { fetchWithAxios } from '../../../../../../../Base/axios/FetchAxios.jsx';
import qs from 'qs';
import { useMemo, useState } from 'react';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { useColorMode } from '../../../../../../../ui/color-mode.jsx';
import { useSelector } from 'react-redux';
import { TableText } from '../../../../../../../Base/Extensions.jsx';

export default function SubmitModalContent({
                                             selectedService = {},
                                             apisDropped,
                                             nodes = [],
                                             onCloseModal,
                                             handleClickShowCelebration,
                                             updated,
                                           }) {
  const accessSlice = useSelector(state => state.accessSlice);
  const [isFetchingApis, setIsFetchingApis] = useState(false);
  const { colorMode } = useColorMode();

  const data = useMemo(() => {
    return nodes.filter((node) => node.id !== '0' && node.type === 'custom').map((node) => node.data);
  }, [nodes]);

  const FunctionalitiesTable = ({ dataValue }) => (
    <TableContainer component={Paper} sx={{ boxShadow: 'none', cursor: 'default' }}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell align="center">{giveText(1)}</TableCell>
            <TableCell align="center">{giveText(313)}</TableCell>
            <TableCell align="center">{giveText(376)}</TableCell>
            <TableCell align="center">{giveText(36)}</TableCell>
            <TableCell align="center">{giveText(196)}</TableCell>
            <TableCell align="center">{giveText(153)}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dataValue.map((node) => (
            <TableRow key={node.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell align="center">
                <TableText cursor={'default'}
                           text={node?.name}
                           maxLength={25}
                           copyable={false}
                           hasCenter={false} />
              </TableCell>
              <TableCell align="center">
                <TableText cursor={'default'}
                           text={node?.project_name}
                           maxLength={10}
                           copyable={false}
                           hasCenter={true} />
              </TableCell>
              <TableCell align="left">
                <TableText cursor={'default'}
                           text={node?.api}
                           maxLength={20}
                           copyable={false}
                           hasCenter={false} />
              </TableCell>
              <TableCell align="center">
                <Box backgroundColor={methodTagIconColor(node?.method, colorMode)}
                     w={'65px'}
                     borderRadius={5}
                     pt={'2px'}>
                  <Text color={'black'} cursor={'default'}>{node?.method?.toString().toUpperCase()}</Text>
                </Box>
              </TableCell>
              <TableCell align="left">
                {commaForEvery3Digit(Math.floor(parseInt(node?.price)))} {giveText(213)}
              </TableCell>
              <TableCell align="left"> <TableText cursor={'default'}
                                                  text={node?.description}
                                                  maxLength={15}
                                                  copyable={false}
                                                  hasCenter={false} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const attachServiceAxios = () => {
    if (!accessSlice.isAdmin && !accessSlice.userAccess?.includes(POST_SERVICE_COMPONENT_MICROSERVICE)) {
      showToast({
        title: giveText(30),
        description: giveText(97),
        status: 2,
      });

    } else {
      const toastId = promiseToast();

      fetchWithAxios.post(`/service_functionality`, {}, {
        params: {
          'service_id': selectedService?.id,
          'functionality_id': apisDropped,
        },
        paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
      }).then((response) => {
        if (checkStatus({ status: response.data.status })) {
          updated();
          onCloseModal();
          handleClickShowCelebration();
        }
        updatePromiseToastSuccessWarningInfo({ toastId, response });
      }).catch((error) => {
        updatePromiseToastError({ toastId, error });
      }).finally(() => {
        setIsFetchingApis(false);
      });
    }
  };

  return <>
    <Box maxH={'600px'} overflowY={'auto'} px={3}>
      {/*<Stack my={3} cursor={'default'}>
        <HStack>
          <Text fontWeight={'800'}>{giveText(1)}:</Text>
          <Text fontWeight={'800'}>
            {giveDir() === 'rtl' ? selectedService?.fa_name : selectedService?.en_name}
          </Text>
        </HStack>

        <Text py={0} fontWeight={'800'} mr={giveDir() === 'rtl' ? 0 : 5} ml={giveDir() === 'rtl' ? 5 : 0}>
          {giveText(38)}:
        </Text>

        <Box w={'100%'}>
          <FloatingLabelEditorJs readOnly={true}
                                 editorType={'inline'}
                                 maxH={'auto'}
                                 minH={0}
                                 dir={giveDir()}
                                 value={giveDir() === 'rtl' ? selectedService?.fa_description : selectedService?.en_description} />
        </Box>
      </Stack>*/}

      <Text fontWeight={'800'} fontSize={'18px'} cursor={'default'}>{giveText(264)}:</Text>
      <Separator mt={2} borderColor={colorMode === 'light' ? 'gray.300' : 'white'} />
      <FunctionalitiesTable dataValue={data} />
    </Box>

    <Center mt={4}>
      <ButtonGroup dir={'ltr'}>
        <Button onClick={() => onCloseModal(false)} colorPalette={'red'} size={'xs'} w={'150px'}>
          {giveText(31)}
        </Button>

        <Button loading={isFetchingApis}
                colorPalette={'green'}
                size={'xs'}
                w={'150px'}
                onClick={attachServiceAxios}>
          {giveText(178)}
        </Button>
      </ButtonGroup>
    </Center>
  </>;
}
