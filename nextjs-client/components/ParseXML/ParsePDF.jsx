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
        //Below are members of Core Class and will be using in Search & Highlight
        const { annotationManager, documentViewer, Annotations } =
          instance.Core;

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
        const searchListener = (searchPattern, options, results) => {
          // add redaction annotation for each search result
          const newAnnotations = results.map((result) => {
            const annotation = new Annotations.RedactionAnnotation();
            annotation.PageNumber = result.pageNum;
            annotation.Quads = result.quads.map((quad) => quad.getPoints());
            annotation.StrokeColor = new Annotations.Color(136, 39, 31);
            return annotation;
          });

          annotationManager.addAnnotations(newAnnotations);
          annotationManager.drawAnnotationsFromList(newAnnotations);
        };

        documentViewer.addEventListener("documentLoaded", () => {
          const searchPattern = "virus";
          // searchPattern can be something like "search*m" with "wildcard" option set to true
          // searchPattern can be something like "search1|search2" with "regex" option set to true

          // options default values are false
          const searchOptions = {
            caseSensitive: true, // match case
            wholeWord: true, // match whole words only
            wildcard: false, // allow using '*' as a wildcard value
            regex: false, // string is treated as a regular expression
            searchUp: false, // search from the end of the document upwards
            ambientString: true, // return ambient string as part of the result
          };

          instance.UI.addSearchListener(searchListener);
          // start search after document loads
          instance.UI.searchTextFull(searchPattern, searchOptions);
          //SearchTextFull default will open the side panel Since searchTextFull will open the search panel, we need to close it immediately.
          instance.closeElements(["searchPanel", "searchOverlay"]);
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
