import { memo, useMemo, useState } from 'react';
import { Button, HStack, Image, Link, Text } from '@chakra-ui/react';
import { ADMIN_ROUTE, DASHBOARD_ROUTE } from '../BaseRouts.jsx';
import { LOGO_COLOR } from '../BaseColor.jsx';
import logo from '../../../assets/icons/Logo.png';

export const LogoNavbar = memo(function LogoNavbar() {
  const [isHovered, setIsHovered] = useState(false);
  const mikhakText = useMemo(() => 'ikhak', []);

  return (
    <Link href={`${ADMIN_ROUTE}${DASHBOARD_ROUTE}`}>
      <Button px={0} dir={'rtl'}
              transition={'all 0.3s ease'}
              mx={setIsHovered ? 2 : 0}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              backgroundColor={'transparent'}
              _hover={{ backgroundColor: 'transparent' }}
              borderRadius={'18px'}>
        <HStack gap={0}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}>
          <Text color={LOGO_COLOR}
                width={isHovered ? '68px' : '0px'}
                opacity={isHovered ? 1 : 0}
                transition={'all 0.2s'}
                fontWeight={'700'}
                pt={1}
                fontSize={'26px'}>
            {mikhakText}
          </Text>

          <Image loading="lazy" alt={'mikhak_logo'} w={'45px'} h={'45px'} src={logo} />
        </HStack>
      </Button>
    </Link>
  );
});
