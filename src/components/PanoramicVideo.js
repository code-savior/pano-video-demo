import React, { useRef, useEffect, useState } from "react";
import Marzipano from "marzipano";
import VideoAsset from "./VideoAsset";

const viewerOpts = {
  controls: {
    mouseViewMode: "drag" // drag|qtvr
  }
};

// const waitForReadyState = function (element, readyState, interval, done) {
//   var timer = setInterval(function () {
//     if (element.readyState >= readyState) {
//       clearInterval(timer);
//       done(null, true);
//     }
//   }, interval);
// };

function PanoramicVideo(props) {
  // Viewer
  const viewerCanvas = useRef(null);
  const [viewer, setViewer] = useState(null);

  useEffect(() => {
    if (viewerCanvas === null) {
      throw TypeError(
        "Container cannot be null, or viewer will not be initialized"
      );
    }
    if (viewerCanvas && viewerCanvas.current && viewer === null) {
      // Create Scene
      setViewer(new Marzipano.Viewer(viewerCanvas.current, viewerOpts));
    }
  }, [viewer, viewerCanvas]);

  useEffect(() => {
    if (viewer) {
      // Create source
      const asset = new VideoAsset();
      const source = new Marzipano.SingleAssetSource(asset);

      const loadVideo = function () {
        var video = document.createElement("video");
        video.src = "//www.marzipano.net/media/video/mercedes-f1-1280x640.mp4";
        video.crossOrigin = "anonymous";

        video.autoplay = true;
        video.muted = true;
        video.loop = true;

        // Prevent the video from going full screen on iOS.
        video.playsInline = true;
        video.webkitPlaysInline = true;

        video.play();

        asset.setVideo(video);
      };

      // Create geometry
      const geometry = new Marzipano.EquirectGeometry([{ width: 1 }]);

      // Create view
      const limiter = new Marzipano.RectilinearView.limit.vfov(
        (90 * Math.PI) / 180,
        (90 * Math.PI) / 180
      );
      const view = new Marzipano.RectilinearView({ fov: Math.PI / 2 }, limiter);

      const scene = viewer.createScene({
        source: source,
        geometry: geometry,
        view: view
      });

      scene.switchTo();
      loadVideo();
    }
  }, [viewer]);

  return <div className="pano" ref={viewerCanvas}></div>;
}

export default PanoramicVideo;
