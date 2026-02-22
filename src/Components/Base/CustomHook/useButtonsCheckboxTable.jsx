import { useEffect, useState } from 'react';
import { Button, HStack, Text } from '@chakra-ui/react';
import { giveText } from '../MultiLanguages/HandleLanguage.jsx';
import { useColorMode } from '../../ui/color-mode.jsx';

export const useButtonsCheckboxTable = ({
                                          isAnyChecked,
                                          onClickFunc,
                                          checkBoxStatus,
                                          title,
                                          hasAccess,
                                          color = ['', ''],
                                          backgroundColor = ['', ''],
                                          hoverBackgroundColor = ['', ''],
                                          icon,
                                        }) => {
  const { colorMode } = useColorMode();
  const [isHoverActiveDefaultButton, setIsHoverActiveDefaultButton] = useState(false);

  const giveTitle = () => {
    return `${title} ${checkBoxStatus.filter(isChecked => isChecked).length} ${giveText(130)}`;
  };

  const ButtonComponent = (
    (isAnyChecked && hasAccess) && (
      <Button width={isHoverActiveDefaultButton ? '200px' : '40px'}
              transition={'width 0.3s'}
              borderRadius={5}
              _hover={{ backgroundColor: colorMode === 'light' ? hoverBackgroundColor[0] : hoverBackgroundColor[1] }}
              loadingText={'Submitting'}
              onClick={onClickFunc}>
        <HStack spacing={isHoverActiveDefaultButton ? 1 : 0}>
          <Text pt={1}
                width={isHoverActiveDefaultButton ? 'full' : '0px'}
                opacity={isHoverActiveDefaultButton ? '100%' : '0'}
                transition={'width 0.3s, opacity 0.5s'}>
            {giveTitle().toString().slice(0, isHoverActiveDefaultButton ? 200 : 2)}
          </Text>

          {icon}
        </HStack>
      </Button>
    )
  );

  return { ButtonComponent };
};
