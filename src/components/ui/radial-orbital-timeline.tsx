"use client";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, Link, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ElementType;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
  isDarkMode?: boolean;
}

export default function RadialOrbitalTimeline({
  timelineData,
  isDarkMode = true,
}: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>(
    {}
  );
  const [viewMode] = useState<"orbital">("orbital");
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [centerOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((key) => {
        if (parseInt(key) !== id) {
          newState[parseInt(key)] = false;
        }
      });

      newState[id] = !prev[id];

      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);

        const relatedItems = getRelatedItems(id);
        const newPulseEffect: Record<number, boolean> = {};
        relatedItems.forEach((relId) => {
          newPulseEffect[relId] = true;
        });
        setPulseEffect(newPulseEffect);

        centerViewOnNode(id);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }

      return newState;
    });
  };

  useEffect(() => {
    let rotationTimer: any;

    if (autoRotate && viewMode === "orbital") {
      rotationTimer = setInterval(() => {
        setRotationAngle((prev) => {
          const newAngle = (prev + 0.3) % 360;
          return Number(newAngle.toFixed(3));
        });
      }, 50);
    }

    return () => {
      if (rotationTimer) {
        clearInterval(rotationTimer);
      }
    };
  }, [autoRotate, viewMode]);

  const centerViewOnNode = (nodeId: number) => {
    if (viewMode !== "orbital" || !nodeRefs.current[nodeId]) return;

    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    const totalNodes = timelineData.length;
    const targetAngle = (nodeIndex / totalNodes) * 360;

    setRotationAngle(270 - targetAngle);
  };

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radius = 180; // slightly smaller radius for better mobile containment
    const radian = (angle * Math.PI) / 180;

    const x = radius * Math.cos(radian) + centerOffset.x;
    const y = radius * Math.sin(radian) + centerOffset.y;

    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(
      0.4,
      Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2))
    );

    return { x, y, angle, zIndex, opacity };
  };

  const getRelatedItems = (itemId: number): number[] => {
    const currentItem = timelineData.find((item) => item.id === itemId);
    return currentItem ? currentItem.relatedIds : [];
  };

  const isRelatedToActive = (itemId: number): boolean => {
    if (!activeNodeId) return false;
    const relatedItems = getRelatedItems(activeNodeId);
    return relatedItems.includes(itemId);
  };

  const getStatusStyles = (status: TimelineItem["status"]): string => {
    switch (status) {
      case "completed":
        return isDarkMode 
          ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" 
          : "text-emerald-800 bg-emerald-100 border-emerald-200";
      case "in-progress":
        return isDarkMode 
          ? "text-purple-400 bg-purple-500/10 border-purple-500/30" 
          : "text-purple-800 bg-purple-100 border-purple-200";
      case "pending":
        return isDarkMode 
          ? "text-zinc-400 bg-zinc-500/10 border-zinc-500/20" 
          : "text-zinc-600 bg-zinc-100 border-zinc-300";
      default:
        return "text-zinc-400 bg-zinc-500/10 border-zinc-500/20";
    }
  };

  return (
    <div
      className={`w-full h-[600px] flex flex-col items-center justify-center rounded-3xl border backdrop-blur-md overflow-hidden relative transition-all duration-500 ${
        isDarkMode
          ? "bg-black/40 border-white/10"
          : "bg-white/45 border-black/10 shadow-xl"
      }`}
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <div className="absolute top-6 left-6 text-left z-10">
        <span className={`text-[10px] tracking-[0.4em] uppercase font-bold ${isDarkMode ? "text-white/50" : "text-zinc-500"}`}>journey map</span>
        <h3 className={`font-heading italic text-2xl mt-1 ${isDarkMode ? "text-white" : "text-zinc-900"}`}>Timeline of Milestones</h3>
      </div>
      <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
        <div
          className="absolute w-full h-full flex items-center justify-center"
          ref={orbitRef}
          style={{
            perspective: "1000px",
            transform: `translate(${centerOffset.x}px, ${centerOffset.y}px)`,
          }}
        >
          {/* Core Central Node */}
          <div className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 animate-pulse flex items-center justify-center z-10">
            <div className={`absolute w-20 h-20 rounded-full border animate-ping opacity-70 ${isDarkMode ? "border-white/20" : "border-black/15"}`}></div>
            <div
              className={`absolute w-24 h-24 rounded-full border animate-ping opacity-50 ${isDarkMode ? "border-white/10" : "border-black/5"}`}
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center font-heading italic text-sm font-bold ${isDarkMode ? "bg-white/80 text-black" : "bg-black/80 text-white"}`}>R</div>
          </div>

          <div className={`absolute w-96 h-96 rounded-full border ${isDarkMode ? "border-white/10" : "border-black/5"}`}></div>

          {timelineData.map((item, index) => {
            const position = calculateNodePosition(index, timelineData.length);
            const isExpanded = expandedItems[item.id];
            const isRelated = isRelatedToActive(item.id);
            const isPulsing = pulseEffect[item.id];
            const Icon = item.icon;

            const nodeStyle = {
              transform: `translate(${position.x}px, ${position.y}px)`,
              zIndex: isExpanded ? 200 : position.zIndex,
              opacity: isExpanded ? 1 : position.opacity,
            };

            return (
              <div
                key={item.id}
                ref={(el) => { nodeRefs.current[item.id] = el; }}
                className="absolute transition-all duration-700 cursor-pointer flex flex-col items-center justify-center"
                style={nodeStyle}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem(item.id);
                }}
              >
                <div
                  className={`absolute rounded-full -inset-1 ${
                    isPulsing ? "animate-pulse duration-1000" : ""
                  }`}
                  style={{
                    background: `radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)`,
                    width: `${item.energy * 0.5 + 40}px`,
                    height: `${item.energy * 0.5 + 40}px`,
                    left: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
                    top: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
                  }}
                ></div>

                <div
                  className={`
                  w-10 h-10 rounded-full flex items-center justify-center z-10
                  ${
                    isExpanded
                      ? isDarkMode ? "bg-white text-black" : "bg-zinc-900 text-white"
                      : isRelated
                      ? isDarkMode ? "bg-white/50 text-black" : "bg-zinc-800/50 text-white"
                      : isDarkMode ? "bg-black text-white" : "bg-white text-zinc-950"
                  }
                  border-2 
                  ${
                    isExpanded
                      ? isDarkMode ? "border-white shadow-lg shadow-white/30" : "border-zinc-900 shadow-lg shadow-zinc-900/20"
                      : isRelated
                      ? isDarkMode ? "border-white animate-pulse" : "border-zinc-900 animate-pulse"
                      : isDarkMode ? "border-white/40" : "border-zinc-900/30"
                  }
                  transition-all duration-300 transform
                  ${isExpanded ? "scale-150" : ""}
                `}
                >
                  <Icon size={16} />
                </div>

                <div
                  className={`
                  absolute top-12 whitespace-nowrap z-10
                  text-[10px] font-semibold tracking-wider
                  transition-all duration-300
                  ${isExpanded ? (isDarkMode ? "text-white" : "text-zinc-950") + " scale-125 font-bold" : (isDarkMode ? "text-white/70" : "text-zinc-700")}
                `}
                >
                  {item.title}
                </div>

                {isExpanded && (
                  <Card className={`absolute top-20 left-1/2 -translate-x-1/2 w-64 backdrop-blur-lg overflow-visible z-[300] border transition-colors duration-300 ${
                    isDarkMode
                      ? "bg-black/95 border-white/30 shadow-xl shadow-white/10"
                      : "bg-white/95 border-zinc-200 shadow-xl shadow-zinc-900/10"
                  }`}>
                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 ${isDarkMode ? "bg-white/50" : "bg-black/50"}`}></div>
                    <CardHeader className="pb-2 p-4">
                      <div className="flex justify-between items-center">
                        <Badge
                          className={`px-2 py-0 text-[9px] ${getStatusStyles(
                            item.status
                          )}`}
                        >
                          {item.status === "completed"
                            ? "COMPLETE"
                            : item.status === "in-progress"
                            ? "IN PROGRESS"
                            : "PENDING"}
                        </Badge>
                        <span className={`text-[10px] font-mono ${isDarkMode ? "text-white/50" : "text-zinc-500"}`}>
                          {item.date}
                        </span>
                      </div>
                      <CardTitle className={`text-sm mt-2 font-heading italic ${isDarkMode ? "text-white" : "text-zinc-900"}`}>
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className={`text-xs p-4 pt-0 ${isDarkMode ? "text-white/80" : "text-zinc-900 font-medium"}`}>
                      <p className="leading-relaxed">{item.content}</p>

                      <div className={`mt-4 pt-3 border-t ${isDarkMode ? "border-white/10" : "border-zinc-200"}`}>
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="flex items-center">
                            <Zap size={10} className="mr-1 text-purple-400" />
                            Significance
                          </span>
                          <span className={`font-mono ${isDarkMode ? "text-purple-300" : "text-purple-600"}`}>{item.energy}%</span>
                        </div>
                        <div className={`w-full h-1 rounded-full overflow-hidden ${isDarkMode ? "bg-white/10" : "bg-zinc-200"}`}>
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                            style={{ width: `${item.energy}%` }}
                          ></div>
                        </div>
                      </div>

                      {item.relatedIds.length > 0 && (
                        <div className={`mt-4 pt-3 border-t ${isDarkMode ? "border-white/10" : "border-zinc-200"}`}>
                          <div className="flex items-center mb-2">
                            <Link size={10} className={`mr-1 ${isDarkMode ? "text-white/70" : "text-zinc-500"}`} />
                            <h4 className={`text-[10px] uppercase tracking-wider font-medium ${isDarkMode ? "text-white/70" : "text-zinc-500"}`}>
                              Connected Moments
                            </h4>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {item.relatedIds.map((relatedId) => {
                              const relatedItem = timelineData.find(
                                (i) => i.id === relatedId
                              );
                              return (
                                <Button
                                  key={relatedId}
                                  variant="outline"
                                  size="sm"
                                  className={`flex items-center h-6 px-2 py-0 text-[10px] rounded-full transition-all bg-transparent ${
                                    isDarkMode
                                      ? "border-white/20 hover:bg-white/10 text-white/80 hover:text-white"
                                      : "border-zinc-300 hover:bg-zinc-100 text-zinc-700 hover:text-zinc-900"
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleItem(relatedId);
                                  }}
                                >
                                  {relatedItem?.title}
                                  <ArrowRight
                                    size={8}
                                    className="ml-1 opacity-70"
                                  />
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
