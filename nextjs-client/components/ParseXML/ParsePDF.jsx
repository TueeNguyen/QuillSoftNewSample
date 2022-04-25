import ZoomIn from "@material-ui/icons/ZoomIn";
import ZoomOut from "@material-ui/icons/ZoomOut";

import { useEffect, useRef } from "react";
import db from "../db";
import KeywordDb from "../KeywordDB";
export default function ParsePDF({ file }) {
  const viewer = useRef(null);

  let keyWord = "";
  useEffect(() => {
    import("@pdftron/webviewer").then(() => {
      WebViewer(
        {
          path: "/webviewer/lib",
          initialDoc: "/files/10.pdf",
        },
        viewer.current
      ).then((instance) => {
        const { docViewer } = instance;

        // zoom level
        const zoomIn = () => {
          instance.setZoomLevel(instance.getZoomLevel() + 0.25);
        };
        const zoomOut = () => {
          if (instance.getZoomLevel() > 0.5) {
            instance.setZoomLevel(instance.getZoomLevel() - 0.25);
          }
        };
        // you can now call WebViewer APIs here...

        //display uploaded file
        db.recentFiles
          .orderBy("created_at")
          .last()
          .then((result) => {
            if (result.file) {
              instance.UI.loadDocument(result.file);
            }
          });

        instance.UI.setHeaderItems(function (header) {
          header.update([
            {
              type: "toggleElementButton",
              img: "icon-header-sidebar-line",
              element: "leftPanel",
              dataElement: "leftPanelButton",
            },
            { type: "divider" },
            { type: "toolButton", toolName: "Pan" },
            {
              type: "actionButton",
              img: "icon-header-zoom-in-line",
              onClick: zoomIn,
              dataElement: "zoomInButton",
            },
            {
              type: "actionButton",
              img: "icon-header-zoom-out-line",
              onClick: zoomOut,
              dataElement: "zoomButton",
            },
          ]);
        });
      });
    });
  }, []);

  return (
    <div className="MyComponent">
      <div className="webviewer" ref={viewer} style={{ height: "100vh" }}></div>
    </div>
  );
}
