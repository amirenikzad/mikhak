  import {
    showToast,
    handleErrors,
    promiseToast,
    updatePromiseToastError,
    updatePromiseToastSuccessWarningInfo,
  } from '../../../Base/BaseFunction.jsx';
  import { fetchWithAxios } from '../../../Base/axios/FetchAxios.jsx';
    
  import { useDispatch, useSelector } from 'react-redux';
  import { useColorMode } from '../../../ui/color-mode.jsx';
  import {
    DialogRoot,
    DialogBody,
    DialogContent,
    DialogBackdrop,
  } from '../../../ui/dialog.jsx';
  import { onCloseModal } from '../../../../store/features/streamSlice';
  import { Box, HStack, Stack, Text, Button, Image } from '@chakra-ui/react';
  import { motion } from 'motion/react';
  import {
    Stepper,
    Step,
    StepLabel,
    StepConnector,
    stepConnectorClasses,
  } from '@mui/material';
  import { styled } from '@mui/material/styles';
  import { useState, useEffect  } from 'react';
  import { PackageCreationIcon } from '../../../Base/CustomIcons/PackageCreationIcon.jsx';
  import { NoActionIcon } from '../../../Base/CustomIcons/NoActionIcon.jsx';
  import { ReleaseIcon } from '../../../Base/CustomIcons/ReleaseIcon.jsx';
  import { ImplementationIcon } from '../../../Base/CustomIcons/ImplementationIcon.jsx';
  import { MonitoringIcon } from '../../../Base/CustomIcons/MonitoringIcon.jsx';
  import { LaunchIcon } from '../../../Base/CustomIcons/LaunchIcon.jsx';
  import no_image_light from '../../../../assets/images/no_image_light.png';
  import no_image_dark from '../../../../assets/images/no_image_dark.png';
  import { giveDir, giveText } from '../../../Base/MultiLanguages/HandleLanguage.jsx';
  import { CheckIcon } from '../../../Base/CustomIcons/CheckIcon.jsx';
  import chip from '../../../../assets/images/ConveyorBelt6.png';
  import factory from '../../../../assets/images/factory.jpg';
  import { Background } from '@xyflow/react';

  const steps = [
    giveText(426),
    giveText(421),
    giveText(422),
    giveText(423), 
    giveText(424),
    giveText(425),
  ];

  const stepIcons = [
    NoActionIcon,   
    PackageCreationIcon,
    ReleaseIcon,     
    ImplementationIcon,
    MonitoringIcon,  
    LaunchIcon  
  ]; 
  // }));
  const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 18,
    },
    [`& .${stepConnectorClasses.line}`]: {
      height: 3,
      border: 0,
      // backgroundColor: theme.palette.mode === 'dark' ? '#555' : '#ccc',
      borderRadius: 1,
      marginLeft: giveDir() === 'rtl' ? '132%' : '0%',
      marginRight: giveDir() === 'rtl' ? '-132%' : '0%',
    },
  }));



  const ColorlibStepIconRoot = styled('div')(({ ownerState }) => ({
    // background: ownerState.active
    //   ? 'linear-gradient(135deg, rgba(255,255,255,0.8), rgba(40, 167, 69,0.8))'
    //   : 'linear-gradient(135deg, rgba(255,255,255,0.6), rgba(40, 167, 69,0.6))',
    zIndex: 1,
    width: 35,
    height: 35,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    // border: ownerState.selected ? '3px solid rgb(40, 167, 69)' : 'none',
    cursor: 'pointer',

    // transition: 'all 0.3s ease',
    // position:"absolute",
    // top:"-40px",
    // marginTop:'20px',
    // boxShadow: ownerState.selected ? '0 0 16px rgba(40, 167, 69,0.6)' : 'none',
    opacity: ownerState.selected ? 1 : 0.4,
    // '&:hover': {
    //   transform: 'scale(1.1)',
    // },
    // transform: ownerState.selected || ownerState.hovered ? 'scale(1.1)' : 'scale(1)',
    transform:
      ownerState.selected || ownerState.hovered
        ? 'scale(1.1)'
        : 'scale(1)',

    // '&:hover': {
    //   transform: 'scale(1.1)',
    // },
    // '& svg': {
    //   transition: 'transform 0.3s ease',
    //   transform: ownerState.selected ? 'scale(1.2)' : 'scale(1)', // بزرگ‌تر شدن آیکون وقتی انتخاب شده
    // },

    // '&:hover svg': {
    //   transform: 'scale(1.25)',
    // },
  }));

  function ColorlibStepIcon({ active, completed, className, onClick, selected, Icon, index, selectedStep, hovered}) {
    const isDone = index <= selectedStep;
    const MotionIcon = motion(Icon);
    // const [hovered, setHovered] = useState(false);

    

    return (
      <ColorlibStepIconRoot
        ownerState={{ active, selected, hovered}}
        className={className}
        onClick={onClick}
        style={{ position: 'relative'}}
        // onMouseEnter={() => setHovered(true)}
        // onMouseLeave={() => setHovered(false)}
      >
        {/* {Icon && (
          <Icon
            width={'3rem'}
            height={'3rem'}
            // style={{ marginBottom: '140px', opacity: 0.8 }}
            // style={{ backgroundColor:'red' }}
          />
        )} */}
        {Icon && (
          <MotionIcon
            width="3rem"
            height="3rem"
            // animate={{
            //   scale: clicked ? 1.3 : 1,
            // }}
            animate={{
                // scale: hovered || selected ? 1.1 : 1,
                scale: selected ? 1.15 : hovered ? 1.1 : 1,
              }}

            transition={{ type: 'spring', stiffness: 250, damping: 15 }}
          />
        )}

        {isDone && (
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            // width="18px"
            // height="18px"
            // width="22px"
            // height="22px"
            borderRadius="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {/* <CheckIcon
              width="30px"
              height="30px"
              fontWeight="bold"
              position="absolute"
              top="-50px"
              // marginBottom={'100px'}
              // top="300%"
            //   top="200%"
            // left="-200%"
              // style={{ color: 'green' }}

            /> */}
          </Box>
        )}
      </ColorlibStepIconRoot>
    );
  }



  export default function DevopsSettingsModal({ selectedDevops, queryClient }) {
    const dispatch = useDispatch();
    const { colorMode } = useColorMode();
    const { isOpenModal } = useSelector((state) => state.streamSlice);

    const service = selectedDevops?.service;
    const org = selectedDevops?.organization;
    const user = selectedDevops?.user;
    const [selectedStep, setSelectedStep] = useState(0);

    const [hoveredStep, setHoveredStep] = useState(null);
    // const [clickedStep, setClickedStep] = useState(null);

  useEffect(() => {
    if (selectedDevops) {
      setSelectedStep(selectedDevops?.status ?? 0);
    }
  }, [selectedDevops]);

  const handleStepClick = (index) => { 
    // setClickedStep(index); 
    setSelectedStep(index);

    // const devops_id = selectedDevops?.devops_id;
    // const service_id = selectedDevops?.service.id;
    // const org_id = selectedDevops?.service.organization.id;
    // const user_id = selectedDevops?.service.user.id;
    const devops_id = selectedDevops?.devops_id;
    const service_id = selectedDevops?.service?.id;
    const org_id = selectedDevops?.organization?.id;
    const user_id = selectedDevops?.user?.id;

    const status = index; 
    
    if (!devops_id) {
      console.warn('⚠️ devops_id is missing!');
      return;
    }

    const toastId = promiseToast(); 

    fetchWithAxios
      .put(`/devops_status?devops_id=${devops_id}&status=${status}&service_id=${service_id}&org_id=${org_id}&user_id=${user_id}`, {})
      .then((response) => { 
        updatePromiseToastSuccessWarningInfo({ toastId, response });
        queryClient.invalidateQueries({ queryKey: ['get_all_devops'] });
      })
      .catch((error) => {
        console.error('❌ Error from backend:', error);
        updatePromiseToastError({ toastId, error });
      });
  };



    return (
      <DialogRoot
        lazyMount
        placement="center"
        size="xl"
        open={isOpenModal}
        onOpenChange={(e) => {
          if (!e.open) dispatch(onCloseModal());
        }}
        dir={giveDir()}
      >
        <DialogBackdrop />
        <DialogContent
          as={motion.div}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          // backgroundColor={colorMode === 'light' ? 'white' : 'gray.800'}
          color={colorMode === 'light' ? 'black' : 'white'}
          p={6}
          borderRadius="xl"
          boxShadow="xl"

          position="relative"
          overflow="hidden"
          backgroundImage={`url(${factory})`}
          backgroundSize="cover"
          backgroundPosition="center"
          backgroundRepeat="no-repeat"
        >
          <Box
            position="absolute"
            top="0"
            left="0"
            width="100%"
            height="100%"
            zIndex="0"
            backgroundColor={
              colorMode === 'light'
                ? 'rgba(0, 0, 0, 0.2)' 
                : 'rgba(0, 0, 0, 0.6)'       
            }
          /> 
          <DialogBody position="relative" zIndex="1">
            <HStack justify="space-between" >
            <HStack  spacing={10} style={{ marginBottom: '140px' }}  >
              <Image
                src={
                  colorMode === 'light'
                    ? service?.light_icon || no_image_light
                    : service?.light_icon || no_image_dark
                }
                boxSize="100px"
                borderRadius="full"
                alt="organization"
              />
              <Text fontWeight="800" fontSize="24px" textAlign="center" mb={0}>
                {giveDir() === 'rtl' ? service?.fa_name : service?.en_name}
              </Text>
            </HStack>

            <Stack spacing={10} mb={20} mt={0} >
              <HStack>
                <Image
                  src={
                    colorMode === 'light'
                      ? org?.image || no_image_light
                      : org?.image || no_image_dark
                  }
                  boxSize="30px"
                  borderRadius="full"
                  alt="organization"
                />
                <Text fontSize="14px" fontWeight="500">
                  {org?.name || '---'}
                </Text>
              </HStack>

              <HStack>
                <Image
                  src={
                    colorMode === 'light'
                      ? user?.profile_pic || no_image_light
                      : user?.profile_pic || no_image_dark
                  }
                  boxSize="30px"
                  borderRadius="full"
                  alt="manager"
                />
                <Text fontSize="14px" fontWeight="500">
                  {`${user?.name || ''} ${user?.family || ''}` || '---'}
                </Text>
              </HStack>
            </Stack>

            </HStack>

            {/* <Box px={2} mt={20} mb={20}>
              <Stepper
                alternativeLabel
                activeStep={selectedStep}
                connector={<ColorlibConnector />}
              >
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel
                      StepIconComponent={(props) => {
                        const IconComponent = stepIcons[index]; 
                        return (
                          <ColorlibStepIcon
                            {...props}
                            Icon={IconComponent}
                            selected={index === selectedStep}
                            index={index}
                            selectedStep={selectedStep} 
                            onClick={() => handleStepClick(index)} 
                          />
                        );
                      }}
                    >
                      <Text 
                        color={colorMode === 'light' ? 'black' : 'white'}
                        fontSize="16px"
                        opacity={index === selectedStep ? 1 : 0.5}
                        >
                          {label}
                      </Text>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box> */}
            <Box position="relative" px={2} mt={20} mb={20}>
              {/* <Image
                // src={'../../../../assets/images/ConveyorBelt.png'}
                src={chip}
                alt="conveyor background"
                position="absolute"
                top="160%"
                left="50%"
                transform="translate(-50%, -50%)"
                // width="160%"
                // height="30%"
                // width="1500px"
                minW={'880px'}
                // height="60px"
                objectFit="contain"
                zIndex={0}
                opacity={0.4}
                filter="brightness(1.5) contrast(0.4)"
                // style={{ backdropFilter: 'blur(8px)' }}

                
              /> */}

              <Stepper
                alternativeLabel
                activeStep={selectedStep}
                connector={<ColorlibConnector />}
                sx={{ position: 'relative', zIndex: 1 ,marginBottom: '170px'}}
              >
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel
                          onMouseEnter={() => setHoveredStep(index)}
                          onMouseLeave={() => setHoveredStep(null)} 
                          style={{
                                  width: '120px',
                                  height: '130px',
                                  cursor: 'pointer',
                                  // marginTop: index === selectedStep
                                  //                 ? '-10px' 
                                  //                 : '0px',
                                  // marginTop: index === selectedStep
                                  //                   ? '-10px'
                                  //                   : index < selectedStep
                                  //                   ? '0'
                                  //                   : hoveredStep === index
                                  //                   ? '-10px'
                                  //                   : '0',

                                  // marginTop:"100px",
                                  marginTop: index === hoveredStep
                                                    ? '90px'
                                                    : selectedStep === index
                                                    ? '90px'
                                                    : '100px',
                                  // height: index === selectedStep
                                  //                 ? '140px' 
                                  //                 : '130px',
                                  // height: index === selectedStep
                                  //                 ? '140px' 
                                  //                 : '130px',
                                  // background: 'linear-gradient(to right, rgba(255,255,255,0.9), rgba(63,169,245,0.4))',
                                  // borderRadius: '16px',
                                  // border: index === selectedStep 
                                  //                 ? '3px solid rgb(40, 167, 69)'
                                  //                 : '1px solid rgba(255,255,255,0.3)',
                                  // boxShadow: index === selectedStep
                                  //                 ? '0 0 15px 4px rgba(40, 167, 69, 0.4)' 
                                  //                 : '0 0 8px rgba(0,0,0,0.1)',
                                  // background:
                                  //   index < selectedStep
                                  //     // ? 'linear-gradient(to right, rgba(40,167,69,0.3), rgba(255,255,255,0.4))'
                                  //     ? 'linear-gradient(to right, rgba(255,255,255,0.4), rgba(40,167,69,0.5))'
                                  //     : index === selectedStep
                                  //     // ? 'linear-gradient(to right, rgba(255,255,255,0.9), rgba(63,169,245,0.4))'
                                  //     ? 'linear-gradient(to right, rgba(40,167,69,0.8), rgba(255,255,255,0.8))'
                                  //     : 'linear-gradient(to right, rgba(255,255,255,0.9), rgba(63,169,245,0.2))',
                                  //     // : 'linear-gradient(to right,  rgba(238, 0, 0, 0.3), rgba(255,255,255,0.9))',
                                  
                                  borderRadius: '16px',
                                  border:
                                    index === selectedStep
                                      ? '3px solid rgba(0, 0, 0, 1)'
                                      : index < selectedStep
                                      ? '2px solid rgba(32, 11, 11, 0.5)'
                                      : '1px solid rgba(255,255,255,0.3)',
                                  // boxShadow:
                                  //   index === selectedStep
                                  //     ? '0 0 15px 4px rgba(40, 167, 69, 0.4)'
                                  //     : index < selectedStep
                                  //     ? '0 0 10px 2px rgba(40,167,69,0.3)'
                                  //     : '0 0 8px rgba(0,0,0,0.1)',
                                  boxShadow:
                                    index === selectedStep
                                      ? '0 0 15px 4px rgba(40, 167, 69, 0.5)'
                                      : index < selectedStep
                                      ? '0 0 10px 2px rgba(40,167,69,0.6)'
                                      : '0 0 8px rgba(0,0,0,0.1)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  backdropFilter: 'blur(6px)',
                                  
                                  // padding: '12px 20px',
                                }}
                                onClick={() => handleStepClick(index)}
                                  StepIconComponent={(props) => {
                                    const IconComponent = stepIcons[index];
                                    return (
                                      <ColorlibStepIcon
                                        {...props}
                                        Icon={IconComponent}
                                        selected={index === selectedStep}
                                        // clicked={index === clickedStep}
                                        hovered={index === hoveredStep}
                                        index={index}
                                        selectedStep={selectedStep}
                                        // onClick={() => handleStepClick(index)}
                                        
                                      />
                                    );
                                  }
                                }
                                >
                      <Text
                        color={colorMode === 'light' ? 'black' : 'white'}
                        // color={colorMode === 'light' ? 'white' : 'white'}
                        fontSize="16px"
                        opacity={index === selectedStep ? 1 : 0.5}
                        // style={{ marginBottom: '140px' }}
                      >
                        {label}
                      </Text>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>



            <Stack align="center" mt={0}>
              <Button colorPalette={'red'} w="full" onClick={() => dispatch(onCloseModal())}>
                  {giveText(80)}
              </Button>
            </Stack>
          </DialogBody>
          
        </DialogContent>
      </DialogRoot>
    );
  }