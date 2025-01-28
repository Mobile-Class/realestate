import { useEffect, useState } from 'react';

const useMouseTracker = () => {
  const [mouseData, setMouseData] = useState([]); // Track mouse movements
  const [clickData, setClickData] = useState([]); // Track mouse clicks
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 }); // Track window dimensions

  useEffect(() => {
    // Record the window size
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    // Track mouse movements
    const handleMouseMove = (event) => {
      setMouseData((prevData) => [
        ...prevData,
        { x: event.clientX, y: event.clientY, time: Date.now() },
      ]);
    };

    // Track mouse clicks
    const handleClick = (event) => {
      setClickData((prevData) => [
        ...prevData,
        { x: event.clientX, y: event.clientY, time: Date.now() },
      ]);
    };

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  // Save both mouse movement and click data as a CSV file
  const saveMouseData = () => {
    const csvContent =
      `Width,Height\n${windowSize.width},${windowSize.height}\n` +
      `Mouse Movements\nx,y,time\n` +
      mouseData.map((d) => `${d.x},${d.y},${d.time}`).join("\n") +
      `\nMouse Clicks\nx,y,time\n` +
      clickData.map((d) => `${d.x},${d.y},${d.time}`).join("\n");

    const encodedUri = encodeURI(`data:text/csv;charset=utf-8,${csvContent}`);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "mouse_data.csv");
    document.body.appendChild(link);
    link.click();
  };

  return { saveMouseData };
};

export default useMouseTracker;
