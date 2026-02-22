import { Box, Button, Center, Grid, GridItem, HStack, Separator } from '@chakra-ui/react';
import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  ConnectionLineType,
} from '@xyflow/react';
import { giveText } from '../../../../../Base/MultiLanguages/HandleLanguage.jsx';
import CustomNodeAPI from './CustomNode/CustomNodeAPI.jsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { fetchWithAxios } from '../../../../../Base/axios/FetchAxios.jsx';
import { useQuery } from '@tanstack/react-query';
import dagre from '@dagrejs/dagre';
import { NodeInfo } from './NodeInfo.jsx';
import { useColorMode } from '../../../../../ui/color-mode.jsx';
import { Tooltip } from '../../../../../ui/tooltip.jsx';
import '@xyflow/react/dist/style.css';
import { MagnifyZoomInFillIcon } from '../../../../../Base/CustomIcons/MagnifyZoomInFillIcon.jsx';
import { MagnifyZoomOutFillIcon } from '../../../../../Base/CustomIcons/MagnifyZoomOutFillIcon.jsx';
import { FullScreenIcon } from '../../../../../Base/CustomIcons/FullScreenIcon.jsx';
import { PrintFillIcon } from '../../../../../Base/CustomIcons/PrintFillIcon.jsx';
import { HierarchyHorizontalIcon } from '../../../../../Base/CustomIcons/HierarchyHorizontalIcon.jsx';
import { HierarchyVerticalIcon } from '../../../../../Base/CustomIcons/HierarchyVerticalIcon.jsx';
import { ExitIcon } from '../../../../../Base/CustomIcons/ExitIcon.jsx';

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
const nodeWidth = 130;
const nodeHeight = 100;

const getLayoutElements = (nodes, edges, direction = 'TB') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      targetPosition: isHorizontal ? 'left' : 'top',
      sourcePosition: isHorizontal ? 'right' : 'bottom',
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: newNodes, edges };
};

export default function OrganizationHierarchy({ organization_id, onClose }) {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const reactToPrintFn = useReactToPrint({ contentRef: reactFlowWrapper });
  const [zoomLevel, setZoomLevel] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [hierarchyDirection, setHierarchyDirection] = useState('TB');
  const [expand, setExpand] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { colorMode } = useColorMode();

  const getOrganizationHierarchyAxios = async () => {
    try {
      const response = await fetchWithAxios.get(`/organization/hierarchy?organization_id=${organization_id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const { data: organizationHierarchyData } = useQuery({
    queryKey: ['get_organization_hierarchy'],
    queryFn: getOrganizationHierarchyAxios,
    refetchOnWindowFocus: false,
  });

  const nodeTypes = {
    custom: (props) => <CustomNodeAPI {...props}
                                      data={{ ...props.data }}
                                      zoomLevel={zoomLevel}
                                      focusedButton={selectedOrganization}
                                      hierarchyDirection={hierarchyDirection} />,
  };

  const processTree = useCallback((node, parentId = null, nodesArray = [], edgesArray = []) => {
    if (!node) return;

    nodesArray.push({
      id: node.id.toString(),
      parentId: parentId && parentId.toString(),
      type: 'custom',
      position: { x: 0, y: 0 },
      data: {
        id: node.id.toString(),
        parentId: parentId && parentId.toString(),
        address: node.address,
        email: node.email,
        lat: node.lat,
        long: node.long,
        name: node.name,
        number: node.number,
        phone_number: node.phone_number,
        logo: node.image,
        description: node.description,
        color: `rgba(${node.color})`,
      },
    });

    if (parentId !== null) {
      edgesArray.push({
        id: `e${node.id}${parentId}`,
        source: parentId.toString(),
        target: node.id.toString(),

        animated: false,
      });
    }

    if (node.children && node.children.length > 0) {
      node.children.forEach((child) =>
        processTree(child, node.id, nodesArray, edgesArray),
      );
    }

    return { nodesArray, edgesArray };
  }, []);

  useEffect(() => {
    if (!organizationHierarchyData) return;

    let nodeArrayList = [{
      id: organizationHierarchyData.id.toString(),
      type: 'custom',
      position: { x: 0, y: 0 },
      data: organizationHierarchyData,
    }];

    const { nodesArray, edgesArray } = processTree(organizationHierarchyData);
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutElements(
      [...nodeArrayList, ...nodesArray],
      edgesArray,
      hierarchyDirection,
    );

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [hierarchyDirection, organizationHierarchyData, processTree]);

  const zoomIn = () => {
    if (reactFlowInstance) {
      reactFlowInstance.zoomIn();
    }
  };

  const zoomOut = () => {
    if (reactFlowInstance) {
      reactFlowInstance.zoomOut();
    }
  };

  const handleFitView = () => {
    if (reactFlowInstance) {
      reactFlowInstance.fitView();
    }
  };

  const handlePrint = () => {
    if (reactFlowInstance) {
      reactToPrintFn();
    }
  };

  const handleNodeClick = (_, node) => {
    setExpand(true);
    setSelectedOrganization(node.data);
  };

  return <>
    <Box width="100%" height={'50px'} borderWidth={2} boxShadow={'sm'} px={5} dir={'rtl'}>
      <Grid templateColumns="repeat(7, 1fr)" gap={1} h={'inherit'}>
        <GridItem colSpan={1} my={'auto'}>
          <Tooltip showArrow content={giveText(69)} bg={'black'} color={'white'} fontWeight={'bold'}>
            <Button p={1} bgColor={'transparent'} onClick={onClose}>
              <ExitIcon color={colorMode === 'light' ? 'black' : 'white'} width={'1.7rem'} />
            </Button>
          </Tooltip>
        </GridItem>

        <GridItem colSpan={6} my={'auto'}>
          <HStack spacing={0} dir={'ltr'}>
            <Tooltip showArrow content={giveText(275)} bg={'black'} color={'white'} fontWeight={'bold'}>
              <Button p={1} bgColor={'transparent'} onClick={zoomIn}>
                <MagnifyZoomInFillIcon color={colorMode === 'light' ? 'black' : 'white'} width={'1.7rem'} />
              </Button>
            </Tooltip>

            <Tooltip showArrow content={giveText(277)} bg={'black'} color={'white'} fontWeight={'bold'}>
              <Button p={1} bgColor={'transparent'} onClick={handleFitView}>
                <FullScreenIcon color={colorMode === 'light' ? 'black' : 'white'} width={'1.7rem'} />
              </Button>
            </Tooltip>

            <Tooltip showArrow content={giveText(276)} bg={'black'} color={'white'} fontWeight={'bold'}>
              <Button p={1} bgColor={'transparent'} onClick={zoomOut}>
                <MagnifyZoomOutFillIcon color={colorMode === 'light' ? 'black' : 'white'} width={'1.7rem'} />
              </Button>
            </Tooltip>

            <Center height="30px">
              <Separator orientation="vertical" height="7" />
            </Center>

            <Tooltip showArrow content={giveText(279)} bg={'black'} color={'white'} fontWeight={'bold'}>
              <Button p={1} bgColor={'transparent'} onClick={handlePrint}>
                <PrintFillIcon color={colorMode === 'light' ? 'black' : 'white'} width={'1.7rem'} />
              </Button>
            </Tooltip>

            <Separator size={'sm'} orientation="vertical" height="7" />

            <Tooltip showArrow content={giveText(279)} bg={'black'} color={'white'} fontWeight={'bold'}>
              <Button p={1} bgColor={'transparent'} onClick={() => setHierarchyDirection('TB')}>
                <HierarchyVerticalIcon color={colorMode === 'light' ? 'black' : 'white'} width={'1.7rem'} />
              </Button>
            </Tooltip>

            <Tooltip showArrow content={giveText(279)} bg={'black'} color={'white'} fontWeight={'bold'}>
              <Button p={1} bgColor={'transparent'} onClick={() => setHierarchyDirection('LR')}>
                <HierarchyHorizontalIcon color={colorMode === 'light' ? 'black' : 'white'} width={'1.7rem'} />
              </Button>
            </Tooltip>
          </HStack>
        </GridItem>
      </Grid>
    </Box>

    <Box style={{ width: '100%', height: '94dvh' }} overflow={'hidden'}>
      <NodeInfo selectedNode={selectedOrganization} expand={expand} setExpand={setExpand} />

      <Box style={{ width: '100vw', height: '100vh' }} ref={reactFlowWrapper}>
        <ReactFlow nodes={nodes}
                   edges={edges}
                   onNodesChange={onNodesChange}
                   onEdgesChange={onEdgesChange}
                   nodeTypes={nodeTypes}
                   colorMode={colorMode}
                   zoomOnDoubleClick={true}
                   zoomOnScroll={true}
                   zoomOnPinch={true}
                   minZoom={0.25}
                   maxZoom={8}
                   onNodeClick={handleNodeClick}
                   onViewportChange={(viewport) => setZoomLevel(viewport.zoom > 2)}
                   connectionLineType={ConnectionLineType.SmoothStep}
                   nodesDraggable={false}
                   onInit={setReactFlowInstance}>
          <Background variant={BackgroundVariant.Dots} />
        </ReactFlow>
      </Box>
    </Box>
  </>;
}
