export interface LoadImageProps {
  height?: number | string | undefined;
  width?: number | string | undefined;
  clsName?: string | undefined;
  alt?: string | undefined;
  img?: string | undefined;
}
const imageDataURI = "https://img.etimg.com/photo/42031747.cms";
const LoadImage = (props: LoadImageProps) => {
  const { height, width, clsName, alt = "ET Image", img } = props || {};
  return (
    <img
      src={img}
      height={height}
      alt={alt}
      width={width}
      className={clsName}
      onError={(e: any) => {
        e.target.onerror = null;
        e.target.src = imageDataURI;
      }}
    />
  );
};

export default LoadImage;
