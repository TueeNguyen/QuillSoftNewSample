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
        // you can now call WebViewer APIs here...
        // KeywordDb.recentKeywords
        //   .orderBy("created_at")
        //   .last()
        //   .then((result) => {
        //     if (result.keyWord) {
        //       console.log("result is " + result.keyWord);
        //     } else {
        //       console.log("result keyword is empty");
        //     }
        //   });
        //display uploaded file
        db.recentFiles
          .orderBy("created_at")
          .last()
          .then((result) => {
            if (result.file) {
              instance.UI.loadDocument(result.file);
            }
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
