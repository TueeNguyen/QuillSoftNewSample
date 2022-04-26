import { useEffect, useRef } from "react";
import db from "../db";

export default function ParsePDF({ file }) {
  const viewer = useRef(null);

  useEffect(() => {
    import("@pdftron/webviewer").then(() => {
      WebViewer(
        {
          path: "/webviewer/lib",
          initialDoc: "/files/10.pdf",
        },
        viewer.current
      ).then((instance) => {
        const { documentViewer, Annotations, Search } = instance.Core;

        // Zoom in & Zomm out
        const zoomIn = () => {
          instance.setZoomLevel(instance.getZoomLevel() + 0.25);
        };
        const zoomOut = () => {
          if (instance.getZoomLevel() > 0.5) {
            instance.setZoomLevel(instance.getZoomLevel() - 0.25);
          }
        };

        //Display uploaded file , receive file from FileUploader.jsx
        db.recentFiles
          .orderBy("created_at")
          .last()
          .then((result) => {
            if (result.file) {
              instance.UI.loadDocument(result.file);
            }
          });

        // Webviewer header (note panel, zoom in and zoom out buttons)
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
        //Search & Highlight
        documentViewer.setSearchHighlightColors({
          // setSearchHighlightColors accepts both Annotations.Color objects or 'rgba' strings
          searchResult: new Annotations.Color(0, 0, 255, 0.5),
          activeSearchResult: "rgba(0, 255, 0, 0.5)",
        });
        documentViewer.addEventListener("documentLoaded", () => {
          const searchText = "virus";
          const mode = Search.Mode.PAGE_STOP | Search.Mode.HIGHLIGHT;
          const searchOptions = {
            // If true, a search of the entire document will be performed. Otherwise, a single search will be performed.
            fullSearch: true,
            // The callback function that is called when the search returns a result.
            onResult: (result) => {
              // with 'PAGE_STOP' mode, the callback is invoked after each page has been searched.
              if (result.resultCode === Search.ResultCode.FOUND) {
                const textQuad = result.quads[0].getPoints(); // getPoints will return Quad objects
                if (result.quads[0] == null) {
                  console.log("nothing found");
                }
                console.log("search quad: " + textQuad.x1);
              }
            },
          };
          documentViewer.textSearchInit(searchText, mode, searchOptions);
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
