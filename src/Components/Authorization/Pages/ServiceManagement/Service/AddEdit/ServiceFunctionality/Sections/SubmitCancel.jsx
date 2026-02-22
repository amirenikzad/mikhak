import { Text, HStack } from '@chakra-ui/react';
import { giveDir, giveText } from '../../../../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { POST_SERVICE_COMPONENT_MICROSERVICE } from '../../../../../../../Base/UserAccessNames.jsx';
import { useSelector } from 'react-redux';
import { lazy, memo, Suspense, useCallback, useState } from 'react';
import { DialogBackdrop, DialogBody, DialogContent, DialogRoot } from '../../../../../../../ui/dialog.jsx';
import { XMarkIcon } from '../../../../../../../Base/CustomIcons/XMarkIcon.jsx';
import { CheckIcon } from '../../../../../../../Base/CustomIcons/CheckIcon.jsx';
import { ClearOutlineIcon } from '../../../../../../../Base/CustomIcons/ClearOutlineIcon.jsx';

const SubmitModalContent = lazy(() => import('./SubmitModalContent'));

export const SubmitCancel = memo(function SubmitCancel({
                                                         selectedService = {},
                                                         apisDropped,
                                                         componentsDropped,
                                                         nodes = [],
                                                         onCloseModal,
                                                         handleClickShowCelebration,
                                                         updated,
                                                         onClear,
                                                       }) {
  const accessSlice = useSelector(state => state.accessSlice);
  const [isHoveredSubmit, setIsHoveredSubmit] = useState(false);
  const [isHoveredCancel, setIsHoveredCancel] = useState(false);
  const [isOpenChangeSelect, setIsOpenChangeSelect] = useState(false);

  const onOpenChangeSelect = useCallback((e) => setIsOpenChangeSelect(e.open), []);

  return <>
    <HStack spacing={1} dir={giveDir(true)}>
      <HStack width={'40px'}
              height={'40px'}
              _hover={{ width: '95px', boxShadow: 'lg' }}
              transition={'all 0.2s ease'}
              borderRadius={'full'}
              backgroundColor={'red.600'}
              onMouseEnter={() => setIsHoveredCancel(true)}
              onMouseLeave={() => setIsHoveredCancel(false)}
              cursor={'pointer'}
              px={2}
              onClick={onCloseModal}>
        <XMarkIcon width={'1.5rem'} color={'white'} />

        <Text color={'white'}>{giveText(31).toString().slice(0, isHoveredCancel ? 20 : 0)}</Text>
      </HStack>

      {(accessSlice.isAdmin || accessSlice.userAccess?.includes(POST_SERVICE_COMPONENT_MICROSERVICE)) &&
        <HStack width={'40px'}
                height={'40px'}
                _hover={{ width: giveDir() === 'rtl' ? '80px' : '100px', boxShadow: 'lg' }}
                transition={'all 0.2s ease'}
                borderRadius={'full'}
                backgroundColor={'green'}
                onMouseEnter={() => setIsHoveredSubmit(true)}
                onMouseLeave={() => setIsHoveredSubmit(false)}
                cursor={'pointer'}
                px={2}
                onClick={() => setIsOpenChangeSelect(true)}>
          <CheckIcon width={'1.5rem'} color={'white'} />

          <Text color={'white'}>{giveText(17).toString().slice(0, isHoveredSubmit ? 20 : 0)}</Text>
        </HStack>
      }

      <HStack spacing={1}
              width={'40px'}
              height={'40px'}
              _hover={{ width: giveDir() ==='rtl' ? '150px' : '85px', boxShadow: 'lg' }}
              transition={'all 0.2s ease'}
              borderRadius={'full'}
              backgroundColor={'orange.600'}
              onMouseEnter={() => setIsHoveredCancel(true)}
              onMouseLeave={() => setIsHoveredCancel(false)}
              cursor={'pointer'}
              px={2}
              onClick={onClear}>
        <ClearOutlineIcon width={'1.5rem'} color={'white'} />

        <Text color={'white'}>{giveText(377).toString().slice(0, isHoveredCancel ? 20 : 0)}</Text>
      </HStack>
    </HStack>

    <DialogRoot lazyMount
                placement={'center'}
                size={'xl'}
                open={isOpenChangeSelect}
                onOpenChange={onOpenChangeSelect}>
      <DialogBackdrop />

      <DialogContent>
        <DialogBody px={2} py={5}>
          <Suspense fallback={'loading...'}>
            <SubmitModalContent onCloseModal={onCloseModal}
                                apisDropped={apisDropped}
                                nodes={nodes}
                                componentsDropped={componentsDropped}
                                updated={updated}
                                handleClickShowCelebration={handleClickShowCelebration}
                                selectedService={selectedService} />
          </Suspense>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  </>;
});
