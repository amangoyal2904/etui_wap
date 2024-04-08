import { Fragment } from "react";
import GreyDivider from "components/GreyDivider";

interface BreadCrumbProps {
  data: { title: string; url?: string }[];
}

export default function BreadCrumb({ data }: BreadCrumbProps) {
  return (
    <>
      <GreyDivider />
      <div className="breadCrumb">
        {data.map((item, i) => (
          <Fragment key={i}>
            {item.url ? (
              <span>
                <a href={item.url} itemProp="item">
                  {item.title}
                </a>
              </span>
            ) : (
              <>{item.title}</>
            )}
          </Fragment>
        ))}
      </div>
      <style jsx>
        {`
          .breadCrumb {
            margin: 10px 0;
            padding: 0 3%;
            font-size: 0.875rem;
            white-space: nowrap;
            overflow-x: scroll;
            overflow-y: hidden;
            font-weight: 900;
            display: block;
            color: #ed1a3b;
          }
          .breadCrumb::-webkit-scrollbar {
            display: none;
          }

          .breadCrumb span {
            display: inline-block;
            font-weight: 400;
          }
          .breadCrumb span a {
            color: #000;
          }

          .breadCrumb span a::after {
            content: "//";
            display: inline-block;
            padding: 0 3px;
          }
        `}
      </style>
    </>
  );
}
