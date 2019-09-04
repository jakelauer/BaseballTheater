export const PlaybackEndpointMap = {
  "/video/tag-search/:tag/:page": (req, res) => {
      res.send({
          express: req.params.tag
      });
  }
};