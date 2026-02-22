import { useNavigate } from 'react-router';
import { AUTHENTICATION_ROUTE, FORGET_PASSWORD_ROUTE, LOGIN_ROUTE, REGISTER_ROUTE } from './BaseRouts.jsx';
import { Box, Center, Flex, HStack, Stack, Text } from '@chakra-ui/react';
import { giveDir, giveText } from './MultiLanguages/HandleLanguage.jsx';
import Avatar from '@mui/material/Avatar';
import { hasPersianText } from './BaseFunction.jsx';
import { LOGO_COLOR, MENU_BACKGROUND_DARK } from './BaseColor.jsx';
import { useColorMode } from '../ui/color-mode.jsx';
import { useEffect, memo, useState } from 'react';
import { Tooltip } from '../ui/tooltip.jsx';
import { toaster } from '../ui/toaster.jsx';
import { CircularInfoOutlineIcon } from './CustomIcons/CircularInfoOutlineIcon.jsx';
import { ConstructionIcon } from './CustomIcons/ConstructionIcon.jsx';
import { ShieldAlertOutlineIcon } from './CustomIcons/ShieldAlertOutlineIcon.jsx';
import { CopyIcon } from './CustomIcons/CopyIcon.jsx';
import { useCopyToClipboard } from './CustomHook/useCopyToClipboard.jsx';
import { NoAvatarUserIcon } from './CustomIcons/NoAvatarUserIcon.jsx';
import { fetchWithAxios } from '../Base/axios/FetchAxios.jsx';

export const HaveAccount = () => {
  const navigate = useNavigate();
  const { colorMode } = useColorMode();

  return (
    <HStack spacing={1} cursor={'pointer'} mt={2}
            onClick={() => navigate(`${AUTHENTICATION_ROUTE}${LOGIN_ROUTE}`)}>
      <CircularInfoOutlineIcon width={'1rem'} color={colorMode === 'light' ? 'blue' : 'white'} />
      <Text dir={'rtl'} fontSize={'14px'} color={colorMode === 'light' ? 'blue.700' : 'gray.300'}>
        {giveText(64)}
      </Text>
    </HStack>
  );
};

// export const ExtensionLogin = () => {
//   const navigate = useNavigate();
//   const { colorMode } = useColorMode();

//   return (
//     <Stack spacing={1}>
//       <HStack spacing={1} cursor={'pointer'} mt={2}
//               onClick={() => navigate(`${AUTHENTICATION_ROUTE}${REGISTER_ROUTE}`)}>
//         <CircularInfoOutlineIcon width={'1rem'} color={colorMode === 'light' ? 'blue' : 'white'} my={'auto'} />
//         <Text dir={giveDir()} fontSize={'14px'} color={colorMode === 'light' ? 'blue.700' : 'gray.200'} my={'auto'}>
//           {giveText(63)}
//         </Text>
//       </HStack>

//       <HStack spacing={1} cursor={'pointer'}
//               onClick={() => navigate(`${AUTHENTICATION_ROUTE}${FORGET_PASSWORD_ROUTE}`)}>
//         <ShieldAlertOutlineIcon width={'1rem'} color={colorMode === 'light' ? 'red' : 'white'} />
//         <Text dir={giveDir()} fontSize={'14px'} color={colorMode === 'light' ? 'blue.700' : 'gray.200'}>
//           {giveText(62)}
//         </Text>
//       </HStack>
//     </Stack>
//   );
// };


export const ExtensionLogin = () => {
  const navigate = useNavigate();
  const { colorMode } = useColorMode();

  const [panelSettings, setPanelSettings] = useState({
    sign_up: false,
    forgot_password: false,
  });

  // useEffect(() => {
  //   axios
  //     .get('http://192.168.17.23:8000/mikhak/api/panel_settings')
  //     .then((res) => {
  //       const normalized = {};
  //       res.data.forEach(item => {
  //         normalized[item.panel_obj_key] = item.panel_obj_value;
  //       });
  //       setPanelSettings(normalized);
  //     })
  //     .catch(err => {
  //       console.error('panel_settings error:', err);
  //     });
  // }, []);
  useEffect(() => {
    fetchWithAxios
      .get('/panel_settings')
      .then((res) => {
        const normalized = {};
        res.data.panels.forEach((item) => {
          normalized[item.panel_obj_key] = item.panel_obj_value;
        });
        setPanelSettings(normalized);
      })
      .catch((err) => {
        console.error('panel_settings error:', err);
      });
  }, []);

  return (
    <Stack spacing={1}>
      {panelSettings.sign_up && (
        <HStack
          spacing={1}
          cursor="pointer"
          mt={2}
          onClick={() =>
            navigate(`${AUTHENTICATION_ROUTE}${REGISTER_ROUTE}`)
          }
        >
          <CircularInfoOutlineIcon
            width="1rem"
            color={colorMode === 'light' ? 'blue' : 'white'}
          />
          <Text
            dir={giveDir()}
            fontSize="14px"
            color={colorMode === 'light' ? 'blue.700' : 'gray.200'}
          >
            {giveText(63)}
          </Text>
        </HStack>
      )}

      {panelSettings.forgot_password && (
        <HStack
          spacing={1}
          cursor="pointer"
          onClick={() =>
            navigate(`${AUTHENTICATION_ROUTE}${FORGET_PASSWORD_ROUTE}`)
          }
        >
          <ShieldAlertOutlineIcon
            width="1rem"
            color={colorMode === 'light' ? 'red' : 'white'}
          />
          <Text
            dir={giveDir()}
            fontSize="14px"
            color={colorMode === 'light' ? 'blue.700' : 'gray.200'}
          >
            {giveText(62)}
          </Text>
        </HStack>
      )}
    </Stack>
  );
};

export const User = memo(function User({
                                         userInfo,
                                         cursor = 'default',
                                         avatarWidth = '40px',
                                         avatarHeight = '40px',
                                         dir = giveDir(),
                                         maxLengthTop = 30,
                                         maxLengthBottom = 30,
                                         fontSizeTop = '15px',
                                         fontWeightTop = '400',
                                         fontSizeBottom = '12px',
                                         copyable = true,
                                         hasBottom = true,
                                         gap = 1,
                                       }) {

  return (
    <HStack dir={dir} gap={gap} color={'black'}>
      <Avatar sx={{ width: avatarWidth, height: avatarHeight }}
              src={userInfo?.profile_pic && userInfo?.profile_pic}>
        <NoAvatarUserIcon />
      </Avatar>

      <Box textAlign={giveDir() === 'rtl' ? 'right' : 'left'} dir={giveDir()}>
        <TableText text={userInfo.username}
                   cursor={cursor}
                   fontSize={fontSizeTop}
                   fontWeight={fontWeightTop}
                   hasCenter={false}
                   copyable={copyable}
                   maxLength={maxLengthTop} />
        {hasBottom &&
          <TableText text={userInfo.email}
                     cursor={cursor}
                     fontSize={fontSizeBottom}
                     hasCenter={false}
                     copyable={copyable}
                     maxLength={maxLengthBottom} />
        }
      </Box>
    </HStack>
  );
});

export function TableText({
                            text = '',
                            cursor = 'default',
                            maxLength = 10,
                            hasCenter = true,
                            hasUnderline = false,
                            copyable = true,
                            ...props
                          }) {
  const [isHovered, setIsHovered] = useState(false);
  const [state, copyToClipboard] = useCopyToClipboard();
  const { colorMode } = useColorMode();
  const CenterOrBox = hasCenter ? Center : Box;
  const dir = giveDir();

  if (!text || !text.toString()?.length) {
    return '';
  }

  const copyTheText = () => {
    if (copyable) {
      copyToClipboard(text);
      toaster.create({
        title: state.error ? giveText(291) : giveText(355),
        description: state.error
          ? `Unable to copy value: ${state.error.message}`
          : state.value && `Copied ${text}`,
        type: state.error ? 'error' : 'success',
        duration: 3000,
      });
    }
  };

  return text && text.length > maxLength
    ? (
      <Tooltip showArrow dir={hasPersianText(text) ? 'rtl' : 'ltr'} content={text} bg={'black'} color={'white'}>
        <CenterOrBox hidden={text === ''}
                     cursor={cursor}
                     onMouseEnter={() => setIsHovered(true)}
                     onMouseLeave={() => setIsHovered(false)}
                     onClick={copyTheText}>
          <Flex>
            <Text textDecoration={hasUnderline ? 'underline' : 'unset'}
                  fontSize={'15px'}
                  fontWeight={'400'}
                  mr={copyable ? (dir === 'rtl' ? 2 : 0) : 0}
                  ml={copyable ? (dir === 'rtl' ? 0 : 2) : 0}
                  color={colorMode === 'light' ? 'black' : 'white'}
                  dir={hasPersianText(text) ? 'rtl' : 'ltr'}
                  {...props}>
              {text.slice(0, maxLength)}...
            </Text>

            <CopyIcon display={copyable && isHovered ? 'inline-block' : 'none'}
                      opacity={isHovered ? 1 : 0}
                      transition={'opacity 0.3s'}
                      width={'1rem'}
                      color={colorMode === 'light' ? 'black' : 'white'} />
          </Flex>
        </CenterOrBox>
      </Tooltip>
    ) : (
      <CenterOrBox hidden={text === ''}
                   cursor={cursor}
                   onMouseEnter={() => setIsHovered(true)}
                   onMouseLeave={() => setIsHovered(false)}
                   onClick={copyTheText}>
        <Flex>
          <Text textDecoration={hasUnderline ? 'underline' : 'unset'}
                fontSize={'15px'}
                fontWeight={'400'}
                mr={copyable ? (dir === 'rtl' ? 2 : 0) : 0}
                ml={copyable ? (dir === 'rtl' ? 0 : 2) : 0}
                color={colorMode === 'light' ? 'black' : 'white'}
                dir={hasPersianText(text) ? 'rtl' : 'ltr'}
                {...props}>
            {text}
          </Text>

          <CopyIcon display={copyable && isHovered ? 'inline-block' : 'none'}
                    opacity={isHovered ? 1 : 0}
                    transition={'opacity 0.3s'}
                    width={'1rem'}
                    color={colorMode === 'light' ? 'black' : 'white'} />
        </Flex>
      </CenterOrBox>
    );
}

export const NewOptionRelative = ({ content, cursor, top = '-7px', right = 2, left = 2 }) => {

  return (
    <Box cursor={cursor} position={'relative'}>
      {content}

      <Box position={'absolute'}
           top={top}
           right={giveDir() === 'ltr' && right}
           left={giveDir() === 'rtl' && left}
           backgroundColor={LOGO_COLOR}
           borderRadius={'5px'}
           px={2}
           pt={'2px'}
           pb={'1px'}>
        <Text dir={giveDir()} color={'white'} fontSize={'10px'}>{giveText(184)}</Text>
      </Box>
    </Box>
  );
};

export const NewOption = ({ cursor = 'pointer' }) => {

  return (
    <Box backgroundColor={LOGO_COLOR}
         borderRadius={'5px'}
         cursor={cursor}
         display={'inline-block'}
         h={'20px'}
         px={2}
         mx={1}
         pt={'4px'}
         pb={'1px'}>
      <Text dir={giveDir()} color={'white'} fontSize={'10px'}>{giveText(184)}</Text>
    </Box>
  );
};

export const UnderConstructor = () => (
  <HStack>
    <ConstructionIcon width={'1rem'} />
    <Text cursor={'default'} pt={1}>{giveText(191)}</Text>
  </HStack>
);

export const IsSuspendTag = () => (
  <Box backgroundColor={MENU_BACKGROUND_DARK}
       borderRadius={'10px'}
       borderWidth={1}
       borderColor={'red'}
       px={2}
       pt={1}>
    <Text dir={giveDir()} color={'red'} fontSize={'10px'}>{giveText(207)} !</Text>
  </Box>
);
