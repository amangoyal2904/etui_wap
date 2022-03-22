import { NextPage } from "next";

const VideoEmbed: NextPage<any> = (props) => {
  return (
    <>
      <div>
        <iframe src='https://m.economictimes.com/videodash.cms?autostart=1&msid=90200064' />
      </div>
    </>
  );
};

export default VideoEmbed;
