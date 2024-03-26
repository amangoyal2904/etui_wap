import Link from "next/link";
import { Fragment } from "react";
import { OtherVidsProps } from "types/videoshow";
import LazyLoadImg from "../LazyLoad";

interface ListProps {
  type: string;
  title: string;
  data: OtherVidsProps;
}

export default function Listing({ type, title, data }: ListProps) {
  const grid = () => {
    return (
      <Fragment>
        <div className="listing">
          <h2>{title}</h2>
          <div className="videoSlider">
            <ul>
              {data.data.map((item, index) => (
                <li key={type + index}>
                  <Link href={item.url}>
                    <a>
                      <LazyLoadImg large={false} img={item.img} alt={item.title} width={135} height={100} />
                      <p>{item.title}</p>
                      {item.type === "videoshow" && <span className="slideVidIcon"></span>}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <style jsx>{`
          .listing h2 {
            padding: 0.5rem 0 0 15px;
            font-size: 1.15rem;
            font-weight: 700;
          }
          .videoSlider {
            overflow-x: scroll;
            overflow-y: hidden;
            -webkit-overflow-scrolling: touch;
            box-sizing: border-box;
            width: 100%;
          }
          .videoSlider::-webkit-scrollbar {
            display: none;
          }

          .videoSlider ul {
            white-space: nowrap;
            padding: 0;
            margin: 0;
          }

          .videoSlider ul li {
            display: inline-block;
            width: 150px;
            position: relative;
            padding-bottom: 12px;
            white-space: normal;
            vertical-align: top;
          }
          .videoSlider ul li::first-child {
            margin-left: 15px;
          }

          li a p {
            font-size: 0.9rem;
            width: 130px;
            line-height: 1.25rem;
          }

          .slideVidIcon {
            background-image: url($common-sprite-path);
            position: absolute;
            top: 30px;
            width: 42px;
            height: 42px;
            left: 45px;
            display: inline-block;
            cursor: pointer;
            background-position: -190px -160px;
            transform: scale(0.8);
          }
        `}</style>
      </Fragment>
    );
  };

  if (type === "grid") {
    return grid();
  }
}
