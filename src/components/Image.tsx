import Image from "next/image";

const loader = ({ src, width, quality }) => {
  const height = width == 640 ? 480 : 150;
  /* We can put the conditional quality, width and height below */
  return `${src},width-${width},height-${height},quality-${quality || 80}/thumb.jpg`;
};
const customLoader = ({ src }) => src;

const NImage = (props) => {
  const { large = false, width, height, img, alt, noResize } = props;
  const w = (noResize && width) || (large ? 640 : 200);
  const h = (noResize && height) || (large ? 480 : 150);

  return (
    <Image
      blurDataURL={!noResize ? "https://img.etimg.com/photo/42031747.cms" : ""}
      placeholder={noResize ? "empty" : "blur"}
      loader={noResize ? customLoader : loader} // different loader properties could be utilised here
      src={img}
      alt={alt}
      width={w}
      loading="eager"
      height={h}
    />
  );
};
export default NImage;
