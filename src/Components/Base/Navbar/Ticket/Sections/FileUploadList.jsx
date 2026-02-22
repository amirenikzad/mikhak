import { memo } from 'react';
import { Box, FileUpload, Float, HStack, Text, useFileUploadContext } from '@chakra-ui/react';
import { XMarkIcon } from '../../../CustomIcons/XMarkIcon.jsx';
import { FileIcon } from '../../../CustomIcons/FileIcon.jsx';

export const FileUploadList = memo(function FileUploadList({ close_id }) {
  const fileUpload = useFileUploadContext();
  const files = fileUpload.acceptedFiles;

  if (files.length === 0) return null;

  return (
    <FileUpload.ItemGroup>
      {files.map((file) => {
        if (file.type.toString().split('/')[0] === 'image') {
          return (
            <Box w={'auto'} position={'absolute'} maxW={'250px'} top={'-90px'} cursor={'default'}>
              <FileUpload.Item w="auto" boxShadow={'xl'} boxSize={'20'} p={'2'} file={file} key={file.name}>
                <FileUpload.ItemPreviewImage />
                <Float placement="top-end">
                  <FileUpload.ItemDeleteTrigger id={close_id} boxSize="4" borderRadius={'full'} layerStyle="fill.solid">
                    <XMarkIcon width={'1rem'} />
                  </FileUpload.ItemDeleteTrigger>
                </Float>
              </FileUpload.Item>
            </Box>
          );
        } else {
          return (
            <Box w={'auto'} position={'absolute'} maxW={'250px'} top={'-45px'} cursor={'default'}>
              <FileUpload.Item w="auto" py={'2'} px={3} boxShadow={'xl'} borderRadius={'10px'} file={file}>
                <HStack>
                  <FileIcon width={'1rem'} />
                  <Text>{file.name}</Text>
                </HStack>
                <Float placement="top-end">
                  <FileUpload.ItemDeleteTrigger id={close_id} boxSize="4" borderRadius={'full'} layerStyle="fill.solid">
                    <XMarkIcon width={'1rem'} />
                  </FileUpload.ItemDeleteTrigger>
                </Float>
              </FileUpload.Item>
            </Box>
          );
        }
      })}
    </FileUpload.ItemGroup>
  );
});
