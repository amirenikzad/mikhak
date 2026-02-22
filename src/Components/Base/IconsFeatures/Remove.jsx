import { Box, Button, HStack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { PERMISSION_NAME, ROLE_NAME, ROLE_PERMISSION_NAME, USER_MANAGEMENT_NAME } from '../PageNames';
import { User } from '../Extensions.jsx';
import { giveDir, giveText } from '../MultiLanguages/HandleLanguage';

export default function Remove({ removeAxios, data = {}, onClose }) {
  const pageSlice = useSelector(state => state.pagesSlice);
  const isLoadingSlice = useSelector(state => state.isLoadingSlice);
  const [body, setBody] = useState(<></>);

  useEffect(() => {
    switch (pageSlice.tab_name) {
      case USER_MANAGEMENT_NAME:
        setBody(<Box my={1}><User userInfo={data} /></Box>);
        break;
      case ROLE_NAME:
        setBody(<></>);
        break;
      case PERMISSION_NAME:
        setBody(<></>);
        break;
      case ROLE_PERMISSION_NAME:
        setBody(<>
            <HStack spacing={8} my={2}>
              <HStack spacing={1}>
                <Text>{giveText(46)}:</Text>
                <Text>{data.role_id}</Text>
              </HStack>

              <HStack spacing={1}>
                <Text>{giveText(12)}:</Text>
                <Text>{data.permission_id}</Text>
              </HStack>
            </HStack>
          </>,
        );
        break;
      default:
        setBody(<></>);
    }
  }, [data, pageSlice.tab_name]);

  return <>
    <Box w={'100%'}>
      <Text dir={giveDir()} fontWeight={'500'} mb={1} cursor={'default'}>{giveText(67)}</Text>

      {body}

      <Box dir={giveDir(true)}>
        <Button size={'xs'}
                px={2}
                backgroundColor={'red'}
                _hover={{ backgroundColor: 'red.600' }}
                color={'white'}
                onClick={() => removeAxios({ data: data, onClose: onClose })}
                loading={isLoadingSlice.isDeleting}>
          {giveText(66)}
        </Button>
      </Box>
    </Box>
  </>;
}
