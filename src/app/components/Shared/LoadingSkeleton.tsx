const LoadingSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
      <div className="bg-gray-200 h-4 rounded w-1/2 mb-2"></div>
      <div className="bg-gray-200 h-4 rounded w-5/6"></div>
    </div>
  );
};

export default LoadingSkeleton;