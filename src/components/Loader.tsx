interface SimpleLoaderProps {
  width?: string;
  height?: string;
  border?: string;
}

const Loader = ({ width = "64px", height = "64px", border = "8px" }: SimpleLoaderProps) => {
  return (
    <div className="loader-container">
      <div className="loader" style={{ width: width, height: height, borderWidth: border }}></div>
    </div>
  );
};

export default Loader;