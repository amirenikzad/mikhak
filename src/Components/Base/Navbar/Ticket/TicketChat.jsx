import { lazy, memo, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { setBreadcrumbAddress } from '../../../../store/features/baseSlice.jsx';
import { giveDir, giveText } from '../../MultiLanguages/HandleLanguage.jsx';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Text,
  Grid,
  Image,
  Input,
  Stack,
  Center,
  HStack,
  Button,
  Drawer,
  Spinner,
  Textarea,
  GridItem,
  Separator,
  FileUpload,
  CloseButton,
  DownloadTrigger,
} from '@chakra-ui/react';
import { MENU_BACKGROUND_DARK, MENU_BACKGROUND_DARK_HOVER } from '../../BaseColor.jsx';
import { ADMIN_ROUTE, TICKET_ROUTE } from '../../BaseRouts.jsx';
import { useTableBaseActions } from '../../CustomHook/useTableBaseActions.jsx';
import { User } from '../../Extensions.jsx';
import { useColorMode } from '../../../ui/color-mode.jsx';
import { convertFileToBase64, giveMessage, hasPersianText, showToast } from '../../BaseFunction.jsx';
import { GET_TICKET_CLOSE, POST_TICKET_CHAT } from '../../UserAccessNames.jsx';
import { fetchWithAxios } from '../../axios/FetchAxios.jsx';
import { toaster } from '../../../ui/toaster.jsx';
import { Tag } from '../../../ui/tag.jsx';
import { useQueryClient } from '@tanstack/react-query';
import { SendIcon } from '../../CustomIcons/SendIcon.jsx';
import { AttachmentOutlineIcon } from '../../CustomIcons/AttachmentOutlineIcon.jsx';
import { ExpandIcon } from '../../CustomIcons/ExpandIcon.jsx';
import { XMarkIcon } from '../../CustomIcons/XMarkIcon.jsx';
import service_support_dark from '../../../../assets/icons/service_support_dark.png';
import service_support_light from '../../../../assets/icons/service_support_light.png';
import { FileUploadList } from './Sections/FileUploadList.jsx';
import { FileIcon } from '../../CustomIcons/FileIcon.jsx';
import { DialogBackdrop, DialogContent, DialogRoot } from '../../../ui/dialog.jsx';
import { DownloadIcon } from '../../CustomIcons/DownloadIcon.jsx';

const PdfReader = lazy(() => import('./PdfReader'));

export default function TicketChat({
                                     selectedTicket,
                                     chatable = true,
                                     isExpand,
                                     setIsExpand,
                                     onClose,
                                     closeTicketAxios,
                                     closingTicket,
                                   }) {
  const accessSlice = useSelector(state => state.accessSlice);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');
  const reactQueryItemName = useMemo(() => 'all_ticket_chat_list_react_query', []);
  const inputFileRef = useRef(null);
  const chatContainerRef = useRef(null);
  const { colorMode } = useColorMode();
  const [sendingMessage, setSendingMessage] = useState(false);
  const [uploadedFile, setUploadedFile] = useState();
  const buttonId = useMemo(() => 'submitChat', []);
  const [isOpenImageModal, setIsOpenImageModal] = useState(false);
  const [isOpenPdfModal, setIsOpenPdfModal] = useState(false);
  const [imageToShowOnModal, setImageToShowOnModal] = useState(null);
  const [pdfToShowOnModal, setPdfToShowOnModal] = useState(null);

  const updated = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [reactQueryItemName] }).then(() => null);
  }, [queryClient, reactQueryItemName]);

  const {
    listValue,
    isFetching,
    handleScroll,
    lastElementRef,
  } = useTableBaseActions({
    getAllURL: '/ticket/chat',
    queryParameter: `&ticket_id=${selectedTicket.id}`,
    hasSearch: false,
    checkAccess: true,
    hasAccessToRemove: false,
    responseKey: 'result',
    reactQueryItemName: reactQueryItemName,
    reverseScroll: true,
    requestEveryMinute: 1,
    pageSize: 10000,
    chatContainerRef: chatContainerRef,
  });

  const chatList = useMemo(() => {
    let result = [];

    if (listValue) {
      let date = listValue[0]?.created_time?.toString().split(' ')[0];
      if (!date) return;

      listValue.map((item) => {
        if ((new Date(item.created_time?.toString().split(' ')[0]).getTime()) < new Date(date).getTime()) {
          result.push({ stickyDate: date });
          result.push(item);
          date = item.created_time.toString().split(' ')[0];
        } else {
          result.push(item);
        }
      });

      result.push({ stickyDate: date });
    }

    return result;
  }, [listValue]);

  useEffect(() => {
    dispatch(setBreadcrumbAddress([
      { type: 'navigate', navigate: `${ADMIN_ROUTE}${TICKET_ROUTE}`, text: giveText(330) },
      { type: 'text', text: giveText(347) },
    ]));
  }, []);

  const postChatAxios = async () => {
    if (!message && !uploadedFile?.files?.[0]) return;

    if (!accessSlice.isAdmin && !accessSlice.userAccess?.includes(POST_TICKET_CHAT)) {
      showToast({
        title: giveText(30),
        description: giveText(97),
        status: 2,
      });
    } else {
      setSendingMessage(true);
      const file = uploadedFile?.files?.[0];
      let base64 = '';
      let extension = '';
      let attach_name = '';

      if (file) {
        base64 = await convertFileToBase64(file);
        extension = file.type;
        attach_name = file.name;
      }

      toaster.promise(
        fetchWithAxios.post(`/ticket/agent/chat`, {
            msg: message,
            // agent: true,
            attach: base64,
            // attach_name: attach_name,
            // extension: extension,
            ticket_id: selectedTicket.id,
          },
        ).then((response) => {
          updated();
          setMessage('');
          setUploadedFile(null);
          document.getElementById('uploaded_file_id').click();
          setSendingMessage(false);
          return {
            title: giveText(158),
            description: giveMessage(response.data.message),
            status: response.data.status,
          };
        }).catch((error) => {
          setSendingMessage(false);
          throw error;
        }), {
          error: (error) => ({
            title: giveText(287),
            description: error.message,
          }),
        },
      );
    }
  };

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {

      } else {
        e.preventDefault();
        await postChatAxios();
      }
    }
  };

  const fetchFile = async (link) => {
    const res = await fetch(link);
    return res.blob();
  };

  const MessageContent = memo(function MessageContent({ item }) {
    return <>
      {item?.attach &&
        <>
          {item.extension?.split('/')?.[0] === 'image' ? (
            <Image key={item?.id}
                   lazy={true}
                   src={item?.attach}
                   cursor={'pointer'}
                   onClick={() => {
                     setImageToShowOnModal(item?.attach);
                     setIsOpenImageModal(true);
                   }} />
          ) : item.extension?.split('/')?.[1] === 'pdf' ? (
            <HStack key={item?.id}
                    cursor={'pointer'}
                    onClick={() => {
                      setPdfToShowOnModal({ url: item?.attach });
                      setIsOpenPdfModal(true);
                    }}>
              <FileIcon width={'1rem'} />
              <Text>{item.attach_name}</Text>
            </HStack>
          ) : (
            <Box key={item?.id} dir={'ltr'} w="auto" pt={1} px={2} mx={1}>
              <DownloadTrigger data={() => fetchFile(item?.attach)}
                               fileName={item?.attach_name}
                               mimeType={item?.extension}
                               asChild>
                <HStack cursor={'pointer'}>
                  <FileIcon width={'1rem'} />
                  <Text>{item.attach_name}</Text>
                </HStack>
              </DownloadTrigger>
            </Box>
          )}
        </>
      }
      {item?.msg &&
        <Text fontSize={'14px'}
              fontWeight={'400'}
              mt={item?.attach ? 2 : 0}
              cursor={'default'}
              dir={hasPersianText(item?.msg) ? 'rtl' : 'ltr'}>
          {item?.msg}
        </Text>
      }
    </>;
  });

  return <>
    <Box px={2} pt={5} pb={2}>
      <Grid templateColumns="repeat(2, 1fr)" gap={4} dir={giveDir()}>
        <GridItem colSpan={1}>
          <HStack gap={0} px={2}>
            <Box cursor={'pointer'}
                 transition={'all 0.2s ease'}
                 borderRadius={8}
                 p={1}
                 _hover={{
                   backgroundColor: 'red',
                   color: 'white',
                 }}
                 onClick={onClose}>
              <XMarkIcon width={'1.5rem'} />
            </Box>

            <Box cursor={'pointer'}
                 transition={'all 0.2s ease'}
                 borderRadius={8}
                 p={1}
                 _hover={{
                   backgroundColor: 'green',
                   color: 'white',
                 }}
                 onClick={() => setIsExpand(prevState => !prevState)}>
              <ExpandIcon width={'1.5rem'} />
            </Box>

            {((accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_TICKET_CLOSE)) && chatable) &&
              <Button mx={2}
                      px={2}
                      loading={closingTicket}
                      size={'sm'}
                      colorPalette={'red'}
                      onClick={() => closeTicketAxios(selectedTicket?.id)}>
                {giveText(356)}
              </Button>
            }
          </HStack>
        </GridItem>

        <GridItem colSpan={1} my={'auto'}>
          <HStack dir={giveDir(true)}>
            <Text fontWeight={'800'}
                  fontSize={'22px'}
                  cursor={'default'}
                  px={2}>
              {selectedTicket.subject}
            </Text>

            <HStack gap={0} cursor={'default'} dir={'ltr'}>
              {selectedTicket?.created_time
                ? (
                  <HStack gap={1}>
                    <Tag colorPalette={'blue'}>
                      {selectedTicket?.created_time.toString().split(' ')[0]}
                    </Tag>
                    <Tag colorPalette={'gray'}>
                      {selectedTicket?.created_time.toString().split(' ')[1].split('.')[0]}
                    </Tag>
                  </HStack>
                ) : (
                  <HStack gap={1}>
                    <Tag colorPalette={'blue'}>
                      {selectedTicket?.closed_time.toString().split(' ')[0]}
                    </Tag>
                    <Tag colorPalette={'gray'}>
                      {selectedTicket?.closed_time.toString().split(' ')[1].split('.')[0]}
                    </Tag>
                  </HStack>
                )
              }
            </HStack>

            <Box mx={1}>
              {selectedTicket?.service &&
                <User gap={1}
                      avatarWidth={'30px'}
                      avatarHeight={'30px'}
                      copyable={false}
                      userInfo={{
                        username: giveDir() === 'rtl' ? selectedTicket?.service?.fa_name : selectedTicket?.service?.en_name,
                        profile_pic: colorMode === 'light' ? selectedTicket?.service?.light_icon : selectedTicket?.service?.dark_icon,
                      }} />
              }
            </Box>
          </HStack>
        </GridItem>
      </Grid>

      <Separator mb={3} mt={2} borderColor={colorMode === 'light' ? 'black' : 'white'} />

      <Box ref={chatContainerRef} onScroll={handleScroll} style={{ overflowY: 'auto' }}>
        <Stack gap={1} h={isExpand ? '84dvh' : '600px'}>
          <Center>
            <HStack my={3} gap={0} ref={lastElementRef}>
              <Text cursor={'default'} color={colorMode === 'light' ? 'black' : 'white'}>
                {giveText(293)}
              </Text>

              {isFetching && <Spinner color={colorMode === 'light' ? 'blue.600' : 'white'} />}
            </HStack>
          </Center>

          {chatList?.slice().reverse().map((item, index) => (
            item.stickyDate ? (
              <Box key={item?.id}>
                <HStack>
                  <Separator flex="1" />
                  <Box flexShrink="0" borderWidth={1} borderRadius={8} px={3} py={1}>
                    <Text cursor={'default'}>{item.stickyDate}</Text>
                  </Box>
                  <Separator flex="1" />
                </HStack>
              </Box>
            ) : (
              item.agent ?
                <HStack dir={'rtl'} px={3}>
                  <Box mb={0} mt={'auto'}>
                    <User gap={0}
                          userInfo={{
                            profile_pic: colorMode === 'light' ? service_support_light : service_support_dark,
                          }} />
                  </Box>

                  <Box key={index}
                       maxW={'350px'}
                       borderWidth={1}
                       px={2}
                       py={2}
                       borderLeftRadius={'20px'}
                       borderTopRightRadius={'20px'}>
                    <Text fontSize={'14px'}
                          fontWeight={'800'}
                          cursor={'default'}
                          dir={'rtl'}>
                      {item?.agent_detail.username}
                    </Text>

                    <MessageContent item={item} />
                  </Box>

                  {item?.attach_name &&
                    <Box mb={2} mt={'auto'}>
                      <DownloadTrigger data={() => fetchFile(item?.attach)}
                                       fileName={item?.attach_name}
                                       mimeType={item?.extension}
                                       asChild>
                        <DownloadIcon cursor={'pointer'} width={'1.8rem'} />
                      </DownloadTrigger>
                    </Box>
                  }

                  <Text fontSize={'12px'}
                        fontWeight={'200'}
                        cursor={'default'}
                        mt={'auto'}
                        mb={2}
                        dir={'ltr'}>
                    {item.created_time?.toString().split(' ')[1].split('.')[0]}
                  </Text>
                </HStack>
                :
                <HStack dir={'ltr'} px={3}>
                  <Box mb={0} mt={'auto'}>
                    <User gap={0}
                          userInfo={{
                            profile_pic: selectedTicket?.user.profile_pic,
                          }} />
                  </Box>

                  <Box key={index}
                       maxW={'350px'}
                       borderWidth={1}
                       px={2}
                       py={2}
                       borderRightRadius={'20px'}
                       borderTopLeftRadius={'20px'}>
                    <Text fontSize={'14px'}
                          fontWeight={'800'}
                          cursor={'default'}
                          dir={'rtl'}>
                      {selectedTicket.user.username}
                    </Text>

                    <MessageContent item={item} />
                  </Box>

                  {item?.attach_name &&
                    <Box mb={2} mt={'auto'}>
                      <DownloadTrigger data={() => fetchFile(item?.attach)}
                                       fileName={item?.attach_name}
                                       mimeType={item?.extension}
                                       asChild>
                        <DownloadIcon cursor={'pointer'} width={'1.8rem'} />
                      </DownloadTrigger>
                    </Box>
                  }

                  <Text fontSize={'12px'}
                        fontWeight={'200'}
                        cursor={'default'}
                        mt={'auto'}
                        mb={2}
                        dir={'ltr'}>
                    {item.created_time?.toString().split(' ')[1].split('.')[0]}
                  </Text>
                </HStack>
            )
          ))}
        </Stack>
      </Box>

      {((accessSlice.isAdmin || accessSlice.userAccess?.includes(POST_TICKET_CHAT)) && chatable) ? (
        <FileUpload.Root onFileAccept={(e) => setUploadedFile(e)}>
          <HStack gap={1}
                  mt={2}
                  borderWidth={1}
                  borderColor={colorMode === 'light' ? 'black' : 'white'}
                  borderRadius={8}
                  bgColor={colorMode === 'light' ? 'white' : MENU_BACKGROUND_DARK}
                  w={'100%'}>
            <Button id={buttonId}
                    transition={'all 0.2s ease'}
                    onClick={postChatAxios}
                    loading={sendingMessage}>
              <SendIcon color={'white'} width={'2rem'} />
            </Button>

            <Stack position={'relative'} w={'100%'} maxH={'40px'}>
              <FileUploadList close_id={'uploaded_file_id'} />

              <Textarea w={'100%'}
                        py={2}
                        px={1}
                        minW={'93%'}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        dir={'auto'}
                        borderWidth={0}
                        outline={'none'}
                        border={'none'}
                        color={colorMode === 'light' ? 'black' : 'white'}
                        focusBorderColor="transparent"
                        variant="outline"
                        placeholder="outline" />
            </Stack>

            <FileUpload.HiddenInput />
            <FileUpload.Trigger asChild>
              <Button bgColor={'transparent'} transition={'all 0.2s ease'}
                      _hover={{ bgColor: colorMode === 'light' ? 'gray.300' : MENU_BACKGROUND_DARK_HOVER }}>
                <AttachmentOutlineIcon width={'1rem'} color={colorMode === 'light' ? 'black' : 'white'} />
              </Button>
            </FileUpload.Trigger>

            <Input ref={inputFileRef} type={'file'} hidden={true} accept={'image/*'} />
          </HStack>
        </FileUpload.Root>
      ) : (
        <>
          <Separator py={1} color={colorMode === 'light' ? 'black' : 'white'} />

          <Center>
            {!(accessSlice.isAdmin || accessSlice.userAccess?.includes(POST_TICKET_CHAT)) && giveText(320)}
            {!chatable && giveText(349)}
          </Center>
        </>
      )}
    </Box>

    <DialogRoot lazyMount
                size={'xl'}
                placement={'center'}
                open={isOpenImageModal}
                onOpenChange={(e) => {
                  setIsOpenImageModal(e.open);
                }}>
      <DialogBackdrop />
      <DialogContent>
        <Image lazy={true} src={imageToShowOnModal} />
      </DialogContent>
    </DialogRoot>

    <Drawer.Root lazyMount={true}
                 size={'md'}
                 open={isOpenPdfModal}
                 onOpenChange={(e) => {
                   setIsOpenPdfModal(e.open);
                 }}>
      <Drawer.Backdrop />
      <Drawer.Positioner>
        <Drawer.Content>
          <Drawer.Body>
            <Suspense fallback={'loading...'}>
              <PdfReader file={pdfToShowOnModal} />
            </Suspense>
          </Drawer.Body>

          <Drawer.CloseTrigger asChild>
            <CloseButton size="sm" />
          </Drawer.CloseTrigger>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  </>;
}
