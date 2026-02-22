import { Box, Text } from '@chakra-ui/react';
import { giveText } from '../MultiLanguages/HandleLanguage.jsx';
import { motion } from 'motion/react';
import { useColorMode } from '../../ui/color-mode.jsx';
import { Tooltip } from '../../ui/tooltip.jsx';
import { FingerPrintIcon } from '../CustomIcons/FingerPrintIcon.jsx';
import { SolidLockIcon } from '../CustomIcons/SolidLockIcon.jsx';
import { SolidLockOpenIcon } from '../CustomIcons/SolidLockOpenIcon.jsx';
import { ConnectionIcon } from '../CustomIcons/ConnectionIcon.jsx';
import { StarFillIcon } from '../CustomIcons/StarFillIcon.jsx';
import { HeartbeatIcon } from '../CustomIcons/HeartbeatIcon.jsx';
import { EditIcon as CustomEditIcon } from '../CustomIcons/EditIcon.jsx';
import { TrashIcon } from '../CustomIcons/TrashIcon.jsx';
import { ServiceIcon } from '../CustomIcons/ServiceIcon.jsx';
import { memo } from 'react';
import { DaemonFillIcon } from '../CustomIcons/DaemonFillIcon.jsx';
import { SellIcon } from '../CustomIcons/SellIcon.jsx';
import { ShowIcon } from '../CustomIcons/ShowIcon.jsx';
import { InfoIcon } from '../CustomIcons/InfoIcon.jsx';

export const UserAdminIcon = memo(function UserAdminIcon({ isAdmin }) {
  return (
    <StarFillIcon aria-label={'tooltipTitle'}
                  bgColor={'transparent'}
                  color={isAdmin ? '#ffb300' : '#c5c5c5'}
                  width={'35px'}
                  cursor={'pointer'} />
  );
});

export const UserDaemonIcon = memo(function UserDaemonIcon({ isDaemon }) {
  return (
    <DaemonFillIcon aria-label={'tooltipTitle'}
                  bgColor={'transparent'}
                  color={isDaemon ? '#ffb300' : '#c5c5c5'}
                  width={'35px'}
                  cursor={'pointer'} />
  );
});

export const UserActiveIcon = memo(function UserActiveIcon({ isActive }) {
  return (
    <HeartbeatIcon aria-label={'tooltipTitle'}
                   bgColor={'transparent'}
                   color={isActive ? 'red' : '#c5c5c5'}
                   width={'29px'}
                   cursor={'pointer'} />
  );
});

export const ServiceSellIcon = memo(function UserActiveIcon({ isActive }) {
  return (
    <SellIcon aria-label={'tooltipTitle'}
                   bgColor={'transparent'}
                   color={isActive ? 'red' : '#c5c5c5'}
                   width={'29px'}
                   cursor={'pointer'} />
  );
});

export const ServiceShowIcon = memo(function UserActiveIcon({ isActive }) {
  return (
    <ShowIcon aria-label={'tooltipTitle'}
                   bgColor={'transparent'}
                   color={isActive ? 'red' : '#c5c5c5'}
                   width={'29px'}
                   cursor={'pointer'} />
  );
});

export const WalletSuspendIcon = memo(function WalletSuspendIcon({ isSuspend }) {
  const { colorMode } = useColorMode();

  const Icon = isSuspend ? SolidLockIcon : SolidLockOpenIcon;
  return <Icon color={isSuspend ? 'red' : colorMode === 'light' ? '#317815' : '#42ff00'} size={'lg'} />;
});

export const RemoveIcon = memo(function RemoveIcon({ size = '1.5rem', onClick, ...props }) {

  return (
    <Box display={'inline-block'} {...props} onClick={onClick}>
      <Tooltip showArrow content={<Text fontWeight={'500'} fontSize={'15px'}>{giveText(7)}</Text>}
               colorPalette={'white'} dir={'rtl'} textAlign={'center'} borderRadius={5}>
        <motion.div transition={{ duration: 0.3 }} whileHover={{ rotate: [null, 15, -5] }}>
          <TrashIcon aria-label={'tooltipTitle'}
                     bgColor={'transparent'}
                     color={'red'}
                     _hover={{ color: '#e32424' }}
                     width={size} cursor={'pointer'} />
        </motion.div>
      </Tooltip>
    </Box>
  );
});


export const EditIcon = memo(function EditIcon({ tooltipTitle = giveText(83), onClick }) {
  const { colorMode } = useColorMode();

  return (
    <Box cursor={'pointer'} display={'inline-block'} onClick={onClick}>
      <Tooltip showArrow content={<Text fontWeight={'500'} fontSize={'15px'}>{tooltipTitle}</Text>}
               colorPalette={'white'} dir={'rtl'} textAlign={'center'} borderRadius={5}>
        <motion.div whileHover={{ rotate: [null, 15, -5] }} transition={{ duration: 0.3 }}>
          <CustomEditIcon width={'25px'}
                          cursor={'pointer'}
                          aria-label={'tooltipTitle'}
                          bgColor={'transparent'}
                          color={colorMode === 'light' ? '#0c3c61' : 'lightblue'}
                          _hover={{ color: colorMode === 'light' ? '#0c3c61' : '#2f6998' }} />
        </motion.div>
      </Tooltip>
    </Box>
  );
});

export const SettingsIcon = memo(function SettingsIcon({
                                                         Icon = ServiceIcon,
                                                         tooltipTitle = giveText(83),
                                                         onClick = () => null,
                                                         fontSize = '1.6rem',
                                                         color = ['#0c3c61', 'lightblue'],
                                                         hoverColor = ['#0c3c61', '#2f6998'],
                                                         ...props
                                                       }) {
  const { colorMode } = useColorMode();

  return (
    <Box display={'inline-block'} onClick={onClick} cursor={'pointer'}>
      <Tooltip showArrow content={<Text fontWeight={'500'} fontSize={'15px'}>{tooltipTitle}</Text>}
               colorPalette={'white'} dir={'rtl'} textAlign={'center'} borderRadius={5}>
        <motion.div whileHover={{ rotate: [null, 15, -5] }} transition={{ duration: 0.3 }}>
          <Icon width={fontSize}
                aria-label={tooltipTitle}
                bgColor={'transparent'}
                color={colorMode === 'light' ? color[0] : color[1]}
                _hover={{ color: colorMode === 'light' ? hoverColor[0] : hoverColor[1] }}
                {...props} />
        </motion.div>
      </Tooltip>
    </Box>
  );
});

export const CheckConnectionIcon = memo(function CheckConnectionIcon({ onClick }) {
  const { colorMode } = useColorMode();

  return (
    <Box display={'inline-block'}>
      <Tooltip showArrow content={<Text fontWeight={'500'} fontSize={'15px'}>{giveText(169)}</Text>}
               colorPalette={'white'} dir={'rtl'} textAlign={'center'} borderRadius={5}>
        <motion.div whileHover={{ rotate: [null, 15, -5] }} transition={{ duration: 0.3 }}>
          <ConnectionIcon aria-label={giveText(169)}
                          size={'lg'}
                          cursor={'pointer'}
                          onClick={onClick}
                          color={colorMode === 'light' ? '#0c3c61' : 'lightblue'}
                          _hover={{ color: colorMode === 'light' ? '#0c3c61' : '#2f6998' }}
          />
        </motion.div>
      </Tooltip>
    </Box>
  );
});

export const ProfilingIcon = memo(function ProfilingIcon() {
  const { colorMode } = useColorMode();

  return (
    <Box display={'inline-block'} mt={1}>
      <Tooltip showArrow content={<Text fontWeight={'500'} fontSize={'15px'}>{giveText(285)}</Text>}
               colorPalette={'white'} dir={'rtl'} textAlign={'center'} borderRadius={5}>
        <motion.div whileHover={{ rotate: [null, 15, -5] }} transition={{ duration: 0.3 }}>
          <FingerPrintIcon mb={1}
                           aria-label={giveText(285)}
                           color={colorMode === 'light' ? '#0c3c61' : 'lightblue'}
                           _hover={{ color: colorMode === 'light' ? '#0c3c61' : '#2f6998' }}
                           width={'1.5rem'}
                           cursor={'pointer'} />
        </motion.div>
      </Tooltip>
    </Box>
  );
});
