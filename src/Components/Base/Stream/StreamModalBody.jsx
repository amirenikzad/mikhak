import { DialogBody, DialogCloseTrigger, DialogFooter } from '../../ui/dialog.jsx';
import { HStack, Progress, Separator, Text } from '@chakra-ui/react';
import { giveText } from '../MultiLanguages/HandleLanguage.jsx';
import { TableText } from '../Extensions.jsx';

export default function StreamModalBody({ streamSlice, IsDone }) {

  return (
    <>
      <DialogBody p={5}>
        <Text fontSize={'18px'} fontWeight={'700'} cursor={'default'}>
          {giveText(169)}
        </Text>

        <Separator mb={3} mt={1} />
        <HStack dir={'ltr'} w={'100%'} fontSize={'18px'} mb={2} cursor={'default'}>
          <Text fontSize={'18px'} fontWeight={'400'}>{giveText(35)}:</Text>

          <TableText fontSize={'18px'}
                     cursor={''}
                     text={`${streamSlice.ip}:${streamSlice.port}${streamSlice.path}`}
                     hasCenter={false}
                     fontWeight={'100'}
                     maxLength={30} />
        </HStack>

        <Progress.Root value={IsDone ? 100 : null} my={1} colorPalette={'cyan'}>
          <Progress.Track borderRadius={8}>
            <Progress.Range />
          </Progress.Track>
        </Progress.Root>
      </DialogBody>

      <DialogFooter>
        <DialogCloseTrigger px={2}>{giveText(80)}</DialogCloseTrigger>
      </DialogFooter>
    </>
  );
}
