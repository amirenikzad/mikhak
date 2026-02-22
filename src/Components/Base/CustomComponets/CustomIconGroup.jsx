import { Box, HStack } from '@chakra-ui/react';
import { TableText } from '../Extensions.jsx';
import { useState } from 'react';
import { Avatar } from '../../ui/avatar.jsx';
import { useColorMode } from '../../ui/color-mode.jsx';
import { MENU_BACKGROUND_LIGHT } from '../BaseColor.jsx';
import { useNavigate } from 'react-router';
import { Tooltip } from '../../ui/tooltip.jsx';
import { WalletIcon } from '../CustomIcons/WalletIcon.jsx';
import { HistoryIcon } from '../CustomIcons/HistoryIcon.jsx';
import { TransactionIcon } from '../CustomIcons/TransactionIcon.jsx';
import { ADMIN_ROUTE, USERS_WALLET_ROUTE, USER_INFO_ROUTE, TRANSACTION_ROUTE } from '../BaseRouts.jsx';
import { giveText } from '../MultiLanguages/HandleLanguage.jsx';
import { ClickIcon } from '../CustomIcons/ClickIcon.jsx';

export const CustomIconGroup = ({ value }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const { colorMode } = useColorMode();
  const navigate = useNavigate();

  return (
    <Box
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsClicked(false);
        setIsHovered(false);
      }}
      transition="all 0.5s ease"
      transform={`scale(${isClicked ? 1.2 : 1})`}
      onClick={() => setIsClicked(true)}
      _hover={{
        transition: '0.5s ease',
        '& ~ div': {
          transform: 'translateX(30px)',
        },
      }}
    >
      <HStack
        spacing={0}
        dir="ltr"
        borderRadius="full"
        borderWidth={isHovered ? 1 : 0}
        className={isHovered && 'box_shadow'}
      >
        <Avatar
          bgColor={colorMode === 'light' ? 'white' : MENU_BACKGROUND_LIGHT}
          boxShadow={!isHovered && 'md'}
          icon={<ClickIcon width={'1.6rem'}/>}
          color ={colorMode === 'light' ? '#0c3c61' : 'lightblue'}
         />

        <Box
          textAlign="left"
          mx={0}
          dir="ltr"
          transition="all 0.5s ease"
          w={isHovered ? '100px' : '0px'}
          opacity={isHovered ? 1 : 0}
          overflow="hidden"
          color ={colorMode === 'light' ? '#0c3c61' : 'lightblue'}
        >
          <Box transition="all 0.3s ease" display={isHovered ? 'block' : 'none'}>
            <HStack spacing={2} mt={1}>
              <Tooltip
                showArrow
                content={giveText(192)}
                bg="black"
                color="white"
                fontWeight="bold"
              >
                <Box
                  as="button"
                  cursor="pointer"
                  onClick={() =>
                    navigate(
                      `${ADMIN_ROUTE}${USERS_WALLET_ROUTE}?search=${value?.username}`,
                    )
                  }
                >
                  <WalletIcon size="lg" />
                </Box>
              </Tooltip>

              <Tooltip
                showArrow
                content={giveText(427)}
                bg="black"
                color="white"
                fontWeight="bold"
              >
                <Box
                  as="button"
                  cursor="pointer"
                  onClick={() =>
                    navigate(
                      `${ADMIN_ROUTE}${USER_INFO_ROUTE}?uname=${value?.username}&uid=${value?.id}`,
                    )
                  }
                >
                  <HistoryIcon size="lg" />
                </Box>
              </Tooltip>

              <Tooltip
                showArrow
                content={giveText(205)}
                bg="black"
                color="white"
                fontWeight="bold"
              >
                <Box
                  as="button"
                  cursor="pointer"
                  onClick={() =>
                    navigate(
                      `${ADMIN_ROUTE}${TRANSACTION_ROUTE}?uname=${value?.username}&uid=${value?.id}`,
                    )
                  }
                >
                  <TransactionIcon size="lg" />
                </Box>
              </Tooltip>
            </HStack>
          </Box>
        </Box>
      </HStack>
    </Box>
  );
};
