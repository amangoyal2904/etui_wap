import React from "react";
import LazyLoad from "react-lazyload";

// const imageDataURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWgAAAEOCAMAAACTln2gAAAAP1BMVEXc3NyUlJTf39/V1dWOjo6bm5ulpaXX19fk5OTMzMyxsbGsrKypqanPz8/GxsbJycmhoaG3t7e7u7vBwcGIiIhm3dvxAAAIoUlEQVR42uzWwUrDQBCA4cluttlEE0zb939WA1ZFFIQeSge+7zyX+ZnDBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZNN7j6lmMk2RU+8leIBao6QSGU+69D7vp2RqxtS1r6fxw/U6Dgm0I3RCtU/7cjOMz1+6ZQ0dPeqny9La8PTaaY2ESpTey03dluGh2nCHtKG/xGH/tfvL+t/Xss7bdjkvr0e41v7s+bacD1uNWOdvsbXxx9g7O2egpSYMRNFkkiEhQAzg/39rE1iMqIAQaZt1Xra7dc9KT6/3vJ2IUlk1z3jstkYu5e3QdYagIfwB0GGNoG29CHobt0H5CDrUvukbFcIA2CzWSc7lDDR7WD5MWFMgZg362WhtDoEWwx6zaYsnpbE2jdJDgD3EFoGyvAPNpqi4wi3bGcdDZJ7VAeHTzGjdu1eg1eYHeJIeePVAujB2eeNsi0ejb//UjDMAYxfjpkOWLMcAY/dKg6gOGB0j2ti7AXkvRnYxc9Ah3K8IeinKIh8eRZcn6IH0WNQwknoGval0jG6q2S9BwUI2QE8ZQI/HfHXsbnBa4iXDjeHN6Ch1L59BK/ZuNNj65rNrSwaR3ZbRvLoAe0q8n+jwGkDbLEEHnSejwd9QfVJ1aC36qTbQeM6wx+gI+pXRqjQZg34y2iaBDqRQjqhdJxhE0ruNjolKYwCd5x48dnRYDF6B3qdQNQrNjVUwglYHjI5/iaBtFUD3WYIeOEerGVySjA6xbgQdhF4zGsY5+iZ0BL3U66ILoLssQU9G6x/QukwGfTHIwwpCb4MOH2EtVIeagS4ROXYKsmzpIQBLoM0u0AFMOWzF0d8RhiyDruX8MS1h4+DCIHfZgga/0kHHNANo14obaFgBHWzeAh27pCs4trmCnjmdDDrQcFzKomewbrS+1Pyl0WptUOGyVTpX0HdO6ya5OsDTuMraRtCwBjo6HUBvpKzk1SjI89fhlE8ZrcuKI1YNwPQA7jP62en4XWEQjci4OoDBx0CDaPEqjYgjo//eqtHvVwdr+dVkeRr8ldGYCJrZYvAO2LC2jX67OhT0Tpqci+OjRrPGCGuPGb2VxvZZg04yemWXAXCgo9X6obMujjWj00+UpRsdkznoNaMTd/e7Ovq3M/7PjFa/HPY/MzqC/vW98V8ZnTnLt/JR0JEuvNvRv11oBuNaAJ142PeN/p43HySAXmnjrY7+puqAdNBKKDVpPFfah4xeMFruB71t4nZH/44iPtlo4/PSYTJ60Wh5CDTnRhwy+ptAQ1J1RNAHjf6e6vjA1FEdN1p+q9G7qwMAWL1mNO0M76PujJa7QGsNZcGROvrsqUNr1bkAmqaOc6cOrcsCjxstv6c6EqcOrfoAOvwwGX3m1KFFWw+gDxn9TeNd4tSh+spxjtXPD5PRZ00dtkLOg9E0R587dRjk96BpZ7iZB9CSm8vaxY0AtGaNbTGApjl6L+ho2RU70EsB754nbtvprdpIO8MEo0vrc3mK9em7rm1NPdqMA2gAoI4+AJpLiXwhg8Zj5qBpjt4DWsYv20E+dTSdMzxqtMe3HD4LPdeRBlou5yb0zWg6Z3hs6ghfzXKqunB3YmNFRu82Ohan2rieUlWMqL3gFc3RR8e7VdBMCR9ljcMf0IzOGR6ZOuZGw3zFq26qsnU4gK4ZPddxitEBM/jPEEgHoxXtDI939Np/fbpE0KWr6bmOlKkjGP3OKxvFxSDN0WlGN2xN6Qmq6pDTOcN00MsXBoMfsa0jo/fk4BkWgKbGAJrOGR4xehv0pC+wpkWOFb2a9CTQMcIiYkVz9IGpI4KG7epgonSItDP8C0Y3HptjNEengIa3SBvnjaad4alTR+CrDCI913Ge0THK9g1NHSmgd4TeZ3ju1BFDrybdazS9z/Ap/0tHk9GnTx0xNEdnZfTXVsc5AVtLMjp96pjuptZA03j3CaNBa1BCkdHndXRYAEw0jWBAoE+eOrToal73Yhl0QdXxAaOZbmp5LUq9ApqM9kk3ukN+rcQqaDpnKNONFgY57xgZfbbRfcGxLhkQ6JN3hgYltiLcAKqO86YOZVFKZwUZ/Ye9s9F1FATCKAMMDD9yQfv+z7qTUpvgldberLu56jHV1IAmX04mQ5qUnYyuSlvrWGgwrt642ru9arRloVGDr5XjMnq3roOFBoRcHneuoPcxWpIqCIDB1dyvleFeNVqVDFB7jk+M/jqj0T/vOiyJhDxf50SfGf11xvbu50YrsqUGN9BLo6fcBh2TOA9/oUaTGA0AU9Rs9BX0xq7jo4NzRmDyJKrRnQfIEZdBH+T/5f+R0Zwz1pnypdE0IlxGPwnDVpFnas4aRvW435lAS6NNOk97R7JgWzvMJD5gGCYDAAhaQ+Kg5asa7RdB50mcBnIRoQG92Ca0JCLJOdfwtM61Xekb7SI0QWv89fu6bYeFRmgxG2cSkXKc8yNoLFbKfolmxgx6WaRPUzpYaGy7DsBtRjPD6I2eg64lZ63pmC8eYUEexeGRkkWSyiPCkljce8eUSyUiPNHRdvcVstaKukpfgCYJIh5wbKeltAkRvpNDUW9gl02GanPFz2EtnZbErOXMYJgsieNirWKGVALCGvgeDrl1c2pTbunkzJhxUL99F841JAnGcsqDCwi9mAH0SwDgdmt7la+1PffuJKaXs+aZY1L2cEtEIlW89yGEaLBDzrgFqOcHYVgx2pfIGJPzPH4BMIjZxBC8D04cp90jMeHsZF9XvYVbPVdMUYs1I1+UycA04/sATKz0UcqIFSmyQSayQ2adyLa/x7RMgyT6brQ3DAudO68y/InPb5NTR8j4jhNSPVJQHawQ9j1qgSSSojVaER8vufd9z2cJsveXH0Pp/TjRz1L/nSvriz/swYEAAAAAAJD/ayOoqqqqqqqqqqq0B4cEAAAAAIL+vzb5AgAAAAAAAAAAAAAAAAAAAAAAgAVGLH0vPnwkJAAAAABJRU5ErkJggg==';
const imageDataURI = "https://img.etimg.com/photo/42031747.cms";
const LazyLoadImg = (props) => {
  let alt = props.alt || "ET Lazy Load Image";
  const height = !props.large ? "150" : "270";
  const width = !props.large ? "200" : "360";
  const placeholder = (
    <img
      className={props.clsName}
      height={props.height || height}
      width={props.width || width}
      src={imageDataURI}
      style={props.style}
      alt={alt}
    />
  );
  return (
    <LazyLoad offset={100} placeholder={placeholder}>
      <img
        src={props.img}
        height={props.height || height}
        alt={alt}
        width={props.width || width}
        style={props.style}
        className={props.clsName}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = imageDataURI;
        }}
      />
    </LazyLoad>
  );
};

export default LazyLoadImg;
