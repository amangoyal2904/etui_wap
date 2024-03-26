import { FC } from "react";
import socialshare from "utils/socialshare";
import Bookmark from "components/Bookmark";

interface SocialShareProps {
  shareParam: {
    shareUrl: string;
    title: string;
    msid: string;
    hostId: string;
    type: string;
  };
}

const SocialShare: FC<SocialShareProps> = ({ shareParam }) => {
  return (
    <div className="socialShare">
      <div className="shareText">Share this Video</div>
      <div className="socialLinks">
        <span onClick={(e) => socialshare.Share(e, { ...shareParam, type: "wa" })} className={`wa commonSprite`}></span>
        <span onClick={(e) => socialshare.Share(e, { ...shareParam, type: "fb" })} className={`fb commonSprite`}></span>
        <span
          onClick={(e) => socialshare.Share(e, { ...shareParam, type: "twt" })}
          className={`twt commonSprite`}
        ></span>
        <span
          onClick={(e) => socialshare.Share(e, { ...shareParam, type: "lin" })}
          className={`in commonSprite`}
        ></span>
        <span
          onClick={(e) => socialshare.Share(e, { ...shareParam, type: "email" })}
          className={`email commonSprite`}
        ></span>
        <span
          onClick={(e) => socialshare.Share(e, { ...shareParam, type: "sms" })}
          className={`sms commonSprite`}
        ></span>
        <Bookmark {...shareParam}></Bookmark>
      </div>
      <style jsx>{`
        .socialShare {
          margin: 1rem;
        }

        .shareText {
          font-weight: 600;
          margin: 15px 0;
        }

        .socialLinks span {
          width: 32px;
          height: 32px;
          transform: scale(0.9, 0.9);
          display: inline-block;
          cursor: pointer;
          margin-right: 8px;
        }

        .socialLinks span .wa {
          background-position: -79px -163px;
        }
        .socialLinks span .fb {
          background-position: -116px -163px;
        }
        .socialLinks span .twt {
          background-position: -154px -163px;
        }
        .socialLinks span .in {
          background-position: -116px -198px;
        }
        .socialLinks span .email {
          background-position: -41px -163px;
        }
        .socialLinks span .sms {
          background-position: -78px -198px;
        }
      `}</style>
    </div>
  );
};

export default SocialShare;
