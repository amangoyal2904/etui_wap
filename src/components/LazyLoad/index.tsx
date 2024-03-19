// import LazyLoad from "react-lazyload";
import { ReactNode, CSSProperties } from "react";

export interface LazyLoadProps {
  once?: boolean | undefined;
  height?: number | string | undefined;
  width?: number | string | undefined;
  offset?: number | number[] | undefined;
  overflow?: boolean | undefined;
  resize?: boolean | undefined;
  scroll?: boolean | undefined;
  children?: ReactNode | undefined;
  throttle?: number | boolean | undefined;
  debounce?: number | boolean | undefined;
  placeholder?: ReactNode | undefined;
  scrollContainer?: string | Element | undefined;
  unmountIfInvisible?: boolean | undefined;
  preventLoading?: boolean | undefined;
  className?: string | undefined;
  classNamePrefix?: string | undefined;
  style?: CSSProperties | undefined;
  alt?: string | undefined;
  img?: string | undefined;
  clsName?: string | undefined;
  large?: boolean | undefined;
}
// const imageDataURI = "https://img.etimg.com/photo/42031747.cms";
const LazyLoadImg = (props: LazyLoadProps) => {
  const alt = props.alt || "ET Lazy Load Image";
  const height = !props.large ? 150 : 270;
  const width = !props.large ? 200 : 360;
  // const placeholder = (
  //   <img
  //     className={props.clsName}
  //     height={props.height || height}
  //     width={props.width || width}
  //     src={imageDataURI}
  //     style={props.style}
  //     alt={alt}
  //   />
  // );
  return (
    // <LazyLoad offset={100} placeholder={placeholder}>
    <img
      src={props.img}
      height={props.height || height}
      alt={alt}
      width={props.width || width}
      style={props.style}
      className={props.clsName}
      loading="lazy"
      decoding="async"
      // onError={(e: any) => {
      //   e.target.onerror = null;
      //   e.target.src = imageDataURI;
      // }}
    />
    // </LazyLoad>
  );
};

export default LazyLoadImg;
