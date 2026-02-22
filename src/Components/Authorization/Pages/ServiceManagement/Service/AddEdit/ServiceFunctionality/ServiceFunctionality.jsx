import { lazy, Suspense, useCallback, useMemo, useState } from 'react';
import { Box, Stack } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { ReactFlow, Controls, Background, useNodesState, useEdgesState, BackgroundVariant } from '@xyflow/react';
import { LOGO_COLOR } from '../../../../../../Base/BaseColor.jsx';
import { giveDir } from '../../../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { ServiceApiInfo } from './Sections/ServiceApiInfo.jsx';
import { SubmitCancel } from './Sections/SubmitCancel.jsx';
import CustomNodeFunctionality from './CustomNode/CustomNodeFunctionality.jsx';
import { GET_SERVICE_COMPONENT_MICROSERVICE } from '../../../../../../Base/UserAccessNames.jsx';
import { fetchWithAxios } from '../../../../../../Base/axios/FetchAxios.jsx';
import { useQuery } from '@tanstack/react-query';
import { BackDropMessage } from '../../../../../../Base/BackDropMessage.jsx';
import CustomNodeRootImage from './CustomNode/CustomNodeRootImage.jsx';
import dagre from '@dagrejs/dagre';
import '@xyflow/react/dist/style.css';

const ApisAccordion = lazy(() => import('./Sections/FunctionalitiesAccordion'));

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
const nodeWidth = 220;
const nodeHeight = 200;
dagreGraph.setGraph({ rankdir: 'TB' });

const getLayoutElements = (nodes, edges) => {
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
      targetPosition: 'top',
      sourcePosition: 'bottom',
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: newNodes, edges };
};

export default function ServiceFunctionality({
                                               selectedService = {},
                                               onCloseModal,
                                               handleClickShowCelebration,
                                               updated,
                                             }) {
  const accessSlice = useSelector(state => state.accessSlice);
  const [nodes, setNodes, onNodesChange] = useNodesState([{
    id: '0',
    type: 'customRootImage',
    data: selectedService,
    position: { x: 600, y: 100 },
  }]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [apisDropped, setApisDropped] = useState([]);

  const handleNodeRemove = useCallback((nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id.toString().split('-')[1] !== nodeId.toString().split('-')[1]));
    setEdges((eds) => eds.filter((edge) => edge.id.toString().split('-')[2] !== nodeId.toString().split('-')[1]));
    setApisDropped((prevState) => prevState.filter((id) => id.toString() !== nodeId.toString().split('-')[1]));
  }, []);

  const handleNodeRemoveAll = () => {
    setNodes((nds) => nds.filter((node) => node.id === '0'));
    setEdges([]);
    setApisDropped([]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const handleDragElements = ({ position, nodeData, newNode, newEdge }) => {
    position = {
      x: position.x + Math.random() * newNode.length * 10,
      y: position.y + Math.random() * newNode.length * 10,
    };

    newNode.push({
      id: `node-${nodeData.id.toString()}`,
      type: 'custom',
      position,
      data: nodeData,
    });

    newEdge.push({
      id: `e0-node-${nodeData.id}`,
      source: '0',
      target: `node-${nodeData.id.toString()}`,
      animated: true,
      style: {
        stroke: LOGO_COLOR,
        strokeWidth: 2,
      },
    });
  };

  const handleDrop = (event) => {
    event.preventDefault();

    const reactFlowBounds = event.target.getBoundingClientRect();
    const nodeData = JSON.parse(event.dataTransfer.getData('application/reactflow'));

    if (!nodeData) return;

    const position = {
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    };

    let newNode = [];
    let newEdge = [];

    nodeData.map((node) => {
      handleDragElements({
        position,
        nodeData: node,
        newEdge,
        newNode,
      });
    });

    const {
      nodes: layoutedNodes,
      edges: layoutedEdges,
    } = getLayoutElements([...nodes, ...newNode], [...edges, ...newEdge]);
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);

    setApisDropped((prev) => [...prev, ...nodeData.map((node) => node.id)]);
  };

  const makeApiGraph = useCallback((items) => {
    if (!items || !items?.length) return;

    let newNode = [];
    let newEdge = [];

    items.map((item, index) => {
      newNode.push({
        id: `node-${item.id.toString()}`,
        type: 'custom',
        position: {
          x: 600 + 150 * index,
          y: 300,
        },
        data: item,
      });

      newEdge.push({
        id: `e0-node-${item.id}`,
        source: '0',
        target: `node-${item.id.toString()}`,
        animated: true,
        style: {
          stroke: LOGO_COLOR,
          strokeWidth: 2,
        },
      });
    });

    const {
      nodes: layoutedNodes,
      edges: layoutedEdges,
    } = getLayoutElements([...nodes, ...newNode], [...edges, ...newEdge]);
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
    setApisDropped((prev) => [...prev, ...items.map((item) => item.id)]);
  }, []);

  const getServiceApiComponentAxios = async () => {
    if (accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_SERVICE_COMPONENT_MICROSERVICE)) {
      return await fetchWithAxios.get(`/service_functionality?service_id=${selectedService.id}`)
        .then((response) => {
          const items = response.data?.connected_items;
          makeApiGraph(items);
          return response.data;
        }).catch((error) => {
          throw error;
        });
    } else {
      return [];
    } 
  };

  console.log('selectedService.id 66', selectedService.id);

  const { isFetching: isFetchingRoles } = useQuery({
    queryKey: ['service_api_component_list', selectedService],
    queryFn: getServiceApiComponentAxios,
    refetchOnWindowFocus: false,
  });

  const nodeTypes = useMemo(() => ({
    customRootImage: (props) => <CustomNodeRootImage {...props} data={{ ...props.data }} />,
    custom: (props) => (
      <CustomNodeFunctionality {...props}
                               data={{
                                 ...props.data,
                                 onDelete: handleNodeRemove,
                                 setApisDropped: setApisDropped,
                               }} />
    ),
  }), [handleNodeRemove]);

  return <>
    <BackDropMessage open={isFetchingRoles} />

    <Stack pos={'absolute'}
           right={giveDir() === 'rtl' && 5}
           left={giveDir() === 'ltr' && 5}
           mx={5}
           mt={5}
           zIndex={'501'}
           width={'400px'}>
      <ServiceApiInfo selectedService={selectedService} nodes={nodes} />

      <Suspense fallback={'loading...'}>
        <ApisAccordion apisDropped={apisDropped} selectedService={selectedService.category_id} />
      </Suspense>
    </Stack>

    <Box position={'absolute'}
         zIndex={'502'}
         top={'20px'}
         left={giveDir() === 'rtl' && '40px'}
         right={giveDir() === 'ltr' && '40px'}>
      <SubmitCancel selectedService={selectedService}
                    nodes={nodes}
                    onCloseModal={onCloseModal}
                    apisDropped={apisDropped}
                    updated={updated}
                    handleClickShowCelebration={handleClickShowCelebration}
                    onClear={handleNodeRemoveAll} />
    </Box>

    <Box style={{ width: '100dvw', height: '100dvh' }}>
      <ReactFlow nodes={nodes}
                 edges={edges}
                 style={{ backgroundColor: 'transparent' }}
                 onNodesChange={onNodesChange}
                 onEdgesChange={onEdgesChange}
                 onDrop={handleDrop}
                 onDragOver={handleDragOver}
        // colorMode={colorMode}
                 nodeTypes={nodeTypes}>
        <Background variant={BackgroundVariant.Dots} />
        <Controls position={giveDir() === 'rtl' ? 'bottom-left' : 'bottom-right'}
                  style={{ color: 'black' }} />
      </ReactFlow>
    </Box>
  </>;
};
