const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizes = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-16 h-16' };

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className={`${sizes[size]} border-4 border-primary-500 border-t-transparent rounded-full animate-spin`} />
      {text && <p className="mt-4 text-gray-400 text-sm">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
