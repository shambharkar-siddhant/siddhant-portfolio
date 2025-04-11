import React, { useState, useEffect, useRef } from 'react';
import { Service } from '../types';
import { AlertTriangle, CheckCircle, Server, Database, ArrowRight, Package, XCircle } from 'lucide-react';

interface ServiceNode {
  id: string;
  x: number;
  y: number;
  status: 'online' | 'warning' | 'error';
  name: string;
}

interface ServiceConnection {
  source: string;
  target: string;
  active: boolean;
}

interface ServiceArchitectureDiagramProps {
  services: Service[];
  onSelectService: (serviceId: string) => void;
}

// A functional component for drawing curved arrows between nodes
const ArrowMarker = ({ from, to, color, isHighlighted }: { 
  from: ServiceNode; 
  to: ServiceNode; 
  color: string;
  isHighlighted: boolean;
}) => {
  // Create a curved path between nodes
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dr = Math.sqrt(dx * dx + dy * dy);
  
  // Calculate end points that stop at node boundaries rather than center
  const nodeRadius = 35; // Approximate radius of the node
  const angle = Math.atan2(dy, dx);
  
  // Starting point (from node boundary)
  const startX = from.x + Math.cos(angle) * nodeRadius;
  const startY = from.y + Math.sin(angle) * nodeRadius;
  
  // Ending point (to node boundary)
  const endX = to.x - Math.cos(angle) * nodeRadius;
  const endY = to.y - Math.sin(angle) * nodeRadius;
  
  // Adjust curve intensity based on distance
  const curveIntensity = Math.min(dr * 0.2, 50);
  
  // Calculate control points for the curve
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;
  const perpX = midX - curveIntensity * Math.sin(angle);
  const perpY = midY + curveIntensity * Math.cos(angle);
  
  // Create SVG path
  const pathData = `M ${startX} ${startY} Q ${perpX} ${perpY} ${endX} ${endY}`;
  
  // Calculate position for the arrowhead
  const arrowLength = 10;
  const arrowWidth = 5;
  
  // Calculate angle for arrowhead
  const dx2 = endX - perpX;
  const dy2 = endY - perpY;
  const endAngle = Math.atan2(dy2, dx2);
  
  const arrowX1 = endX - arrowLength * Math.cos(endAngle) + arrowWidth * Math.sin(endAngle);
  const arrowY1 = endY - arrowLength * Math.sin(endAngle) - arrowWidth * Math.cos(endAngle);
  const arrowX2 = endX - arrowLength * Math.cos(endAngle) - arrowWidth * Math.sin(endAngle);
  const arrowY2 = endY - arrowLength * Math.sin(endAngle) + arrowWidth * Math.cos(endAngle);
  
  return (
    <>
      <path 
        d={pathData} 
        fill="none" 
        stroke={color} 
        strokeWidth={isHighlighted ? 3 : 1.5} 
        opacity={isHighlighted ? 1 : 0.6}
        strokeDasharray={isHighlighted ? "none" : "5,3"}
      />
      <polygon 
        points={`${endX},${endY} ${arrowX1},${arrowY1} ${arrowX2},${arrowY2}`} 
        fill={color}
        opacity={isHighlighted ? 1 : 0.6}
      />
    </>
  );
};

const ServiceArchitectureDiagram: React.FC<ServiceArchitectureDiagramProps> = ({ services, onSelectService }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [nodes, setNodes] = useState<ServiceNode[]>([]);
  const [connections, setConnections] = useState<ServiceConnection[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 400 });
  const [isDragging, setIsDragging] = useState(false);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Initialize the node positions based on the services
  useEffect(() => {
    if (!services.length) return;
    
    const width = svgRef.current?.clientWidth || 800;
    const height = svgRef.current?.clientHeight || 400;
    setContainerSize({ width, height });
    
    // Create nodes in a circular layout
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;
    
    const initialNodes: ServiceNode[] = services.map((service, index) => {
      const angle = (2 * Math.PI * index) / services.length;
      return {
        id: service.id,
        name: service.name,
        status: service.status,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });
    
    setNodes(initialNodes);
    
    // Define connections between services
    // This is a simplified example; you might want to derive these from actual service dependencies
    const initialConnections: ServiceConnection[] = [
      { source: 'api-gateway', target: 'auth-service', active: true },
      { source: 'api-gateway', target: 'data-processor', active: true },
      { source: 'api-gateway', target: 'search-engine', active: true },
      { source: 'auth-service', target: 'cache-service', active: true },
      { source: 'data-processor', target: 'storage-service', active: false },
      { source: 'search-engine', target: 'data-processor', active: true },
      { source: 'auth-service', target: 'notif-service', active: true },
    ];
    
    // Filter connections to only include services that exist
    const validConnections = initialConnections.filter(conn => 
      initialNodes.some(node => node.id === conn.source) && 
      initialNodes.some(node => node.id === conn.target)
    );
    
    setConnections(validConnections);
  }, [services]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (svgRef.current) {
        setContainerSize({
          width: svgRef.current.clientWidth,
          height: svgRef.current.clientHeight
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle mouse down for dragging
  const handleNodeMouseDown = (nodeId: string, e: React.MouseEvent) => {
    if (isDragging) return;
    
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    
    // Calculate offset from node center
    const offsetX = e.clientX - node.x;
    const offsetY = e.clientY - node.y;
    
    setIsDragging(true);
    setDraggedNode(nodeId);
    setDragOffset({ x: offsetX, y: offsetY });
  };
  
  // Handle mouse move for dragging
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !draggedNode) return;
    
    const svgRect = svgRef.current?.getBoundingClientRect();
    if (!svgRect) return;
    
    // Calculate new position
    const mouseX = e.clientX - svgRect.left;
    const mouseY = e.clientY - svgRect.top;
    
    // Update the node position
    setNodes(prev => prev.map(node => {
      if (node.id === draggedNode) {
        return {
          ...node,
          x: mouseX - dragOffset.x,
          y: mouseY - dragOffset.y
        };
      }
      return node;
    }));
  };
  
  // Handle mouse up to end dragging
  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      setDraggedNode(null);
    }
  };

  // Get status color for a node
  const getStatusColor = (status: 'online' | 'warning' | 'error') => {
    switch (status) {
      case 'online': return 'rgb(34, 197, 94)';
      case 'warning': return 'rgb(234, 179, 8)';
      case 'error': return 'rgb(239, 68, 68)';
      default: return 'rgb(156, 163, 175)';
    }
  };
  
  // Get status icon for a node
  const StatusIcon = ({ status }: { status: 'online' | 'warning' | 'error' }) => {
    switch (status) {
      case 'online': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'error': return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };
  
  // Get service type icon
  const ServiceIcon = ({ id }: { id: string }) => {
    if (id.includes('api') || id.includes('gateway')) {
      return <Package className="h-6 w-6" />;
    } else if (id.includes('data') || id.includes('storage') || id.includes('cache')) {
      return <Database className="h-6 w-6" />;
    } else {
      return <Server className="h-6 w-6" />;
    }
  };
  
  // Determine if a connection should be highlighted
  const isConnectionHighlighted = (conn: ServiceConnection) => {
    return hoveredNode === conn.source || hoveredNode === conn.target;
  };
  
  // Determine the appropriate color for a connection
  const getConnectionColor = (conn: ServiceConnection) => {
    if (!conn.active) return 'rgb(156, 163, 175)'; // Gray for inactive connections
    
    const sourceNode = nodes.find(n => n.id === conn.source);
    const targetNode = nodes.find(n => n.id === conn.target);
    
    if (!sourceNode || !targetNode) return 'rgb(156, 163, 175)';
    
    // Connection color based on the status of source and target
    if (sourceNode.status === 'error' || targetNode.status === 'error') {
      return 'rgb(239, 68, 68)'; // Red for error
    } else if (sourceNode.status === 'warning' || targetNode.status === 'warning') {
      return 'rgb(234, 179, 8)'; // Yellow for warning
    }
    
    return 'rgb(34, 197, 94)'; // Green for healthy connections
  };

  return (
    <div className="w-full relative" style={{ height: '400px' }}>
      <svg 
        ref={svgRef}
        className="w-full h-full bg-transparent" 
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Connections between nodes */}
        {connections.map((conn, index) => {
          const sourceNode = nodes.find(n => n.id === conn.source);
          const targetNode = nodes.find(n => n.id === conn.target);
          
          if (!sourceNode || !targetNode) return null;
          
          const connectionColor = getConnectionColor(conn);
          const highlighted = isConnectionHighlighted(conn);
          
          return (
            <ArrowMarker
              key={`${conn.source}-${conn.target}`}
              from={sourceNode}
              to={targetNode}
              color={connectionColor}
              isHighlighted={highlighted}
            />
          );
        })}
        
        {/* Service nodes */}
        {nodes.map(node => {
          const statusColor = getStatusColor(node.status);
          const isHovered = hoveredNode === node.id;
          
          return (
            <g 
              key={node.id}
              transform={`translate(${node.x}, ${node.y})`}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              onMouseDown={(e) => handleNodeMouseDown(node.id, e)}
              onClick={() => onSelectService(node.id)}
              style={{ cursor: 'pointer' }}
            >
              {/* Node circle background */}
              <circle 
                r={35} 
                fill={isHovered ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)'} 
                stroke={statusColor} 
                strokeWidth={isHovered ? 3 : 2} 
                className="transition-all duration-150"
              />
              
              {/* Service icon */}
              <foreignObject x={-12} y={-20} width={24} height={24}>
                <div className="flex justify-center items-center text-foreground">
                  <ServiceIcon id={node.id} />
                </div>
              </foreignObject>
              
              {/* Status indicator */}
              <foreignObject x={-10} y={10} width={20} height={20}>
                <div className="flex justify-center items-center" style={{ color: statusColor }}>
                  <StatusIcon status={node.status} />
                </div>
              </foreignObject>
              
              {/* Service name label */}
              <foreignObject x={-60} y={38} width={120} height={30}>
                <div className="text-xs text-center text-muted-foreground px-1 py-0.5 rounded bg-background bg-opacity-80">
                  {node.name}
                </div>
              </foreignObject>
            </g>
          );
        })}
      </svg>
      
      {/* Legend */}
      <div className="absolute bottom-2 right-2 bg-background bg-opacity-80 p-2 rounded text-xs flex flex-col gap-1">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
          <span>Online</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
          <span>Warning</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
          <span>Error</span>
        </div>
      </div>
      
      {/* Instructions */}
      <div className="absolute top-2 left-2 bg-background bg-opacity-80 p-2 rounded text-xs">
        <span>Drag nodes to reposition • Click to view details</span>
      </div>
    </div>
  );
};

export default ServiceArchitectureDiagram;