import { useEffect, useRef, useState } from "react";
import db from "../db";
export default function ParsePDF2({ file }) {
  const viewer = useRef(null);
  const scrollView = useRef(null);
  const [documentViewer, setDocumentViewer] = useState(null);

  useEffect(() => {
    //const Core = WebViewerInstance.Core;
    console.log(Core);
    Core.setWorkerPath("/public/webviewer/lib/core");
    Core.enableFullPDF();

    const documentViewer = new Core.DocumentViewer();
    documentViewer.setScrollViewElement(scrollView.current);
    documentViewer.setViewerElement(viewer.current);
    db.recentFiles
      .orderBy("created_at")
      .last()
      .then((result) => {
        if (result.file) {
          documentViewer.loadDocument(result.file);
        }
      });

    setDocumentViewer(documentViewer);
    console.log("ParsePDF2");
  }, []);

  return (
    <div className="MyComponent">
      <div className="webviewer" ref={viewer} style={{ height: "100vh" }}></div>
    </div>
  );
}
