import { NextFunction, Request, Response } from "express-serve-static-core";
import fetch from "cross-fetch";
import { VideoSearchResults } from "baseball-theater-engine/contract/videosearch";

export const PlaybackEndpointMap: {
  [key: string]: (req: Request, res: Response, next: NextFunction) => void;
} = {
  "/video/tag-search/:tag/:page": (req, res) => {
    fetch(
      `https://www.mlb.com/data-service/en/search?tags.slug=${req.params.tag}&page=${req.params.page}`
    )
      .then(response => response.json())
      .then(json => {
        const docs: VideoSearchResults[] = json.docs;
        const promises = docs.map(async item => {
          const slug = item.slug;
          const videoDataUrl = `https://www.mlb.com/data-service/en/videos/${slug}`;
          console.log(videoDataUrl);

          const json = await fetch(videoDataUrl).then(response =>
            response.json()
          );

          return {
            about: item,
            video: json
          };
        });

        Promise.all(promises).then(data => {
          res.send({
            express: data
          });
        });
      });
  }
};
