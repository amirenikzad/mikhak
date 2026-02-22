import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { USER_MANAGEMENT_NAME } from '../PageNames.jsx';
import { MENU_BACKGROUND_DARK_HOVER } from '../BaseColor.jsx';
import { Button } from '@chakra-ui/react';
import { driver } from 'driver.js';
import "driver.js/dist/driver.css";
import { CircularInfoOutlineIcon } from '../CustomIcons/CircularInfoOutlineIcon.jsx';

export const Tour = () => {
  const pagesSlice = useSelector(state => state.pagesSlice);

  const popoverContent = useMemo(() => {
    let content = [];

    switch (pagesSlice.page_name) {
      case USER_MANAGEMENT_NAME:
        content = [
          {
            element: '#table_row_0',
            popover: {
              title: 'Table Rows',
              description: `${USER_MANAGEMENT_NAME} table content is available here`,
              side: 'left',
              align: 'start',
            },
          },
        ];
        break;
    }

    return content;
  }, [pagesSlice.page_name]);

  const driverObj = driver({
    showProgress: true,
    steps: popoverContent,
  });

  return <>
    <Button p={0}
            borderRadius={'full'}
            aria-label={'start tour'}
            backgroundColor={'transparent'}
            onClick={() => driverObj.drive()}
            _hover={{ backgroundColor: MENU_BACKGROUND_DARK_HOVER }}>
      <CircularInfoOutlineIcon color={'white'} width={'1.5rem'} />
    </Button>
  </>;
};
