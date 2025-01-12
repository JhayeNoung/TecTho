import noImage from "../assets/blank.jpg";


export const optimizedImage = (url: string) => {
  if (!url) return noImage;
  console.log(url)
  const index = url.indexOf("images/") + "images/".length;
  const optImg = url.slice(0, index) + "crop/600/400/" + url.slice(index);
  console.log(optImg)
  return optImg;
};

// url = https://example.com/media/image123.jpg
// optImg = https://example.com/media/crop/600/400/image123.jpg