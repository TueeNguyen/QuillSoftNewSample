import { useEffect, useRef, useState } from 'react';
import styles from '../../styles/Home.module.css';
import db from '../db';
export default function ParsePDF2({ keyWord }) {
  const viewer = useRef(null);
  const viewer2 = useRef(null);
  const [instance, Setinstance] = useState(null);
  const [instance2, Setinstance2] = useState(null);
  const [viewer2Css, Setviewer2Css] = useState(styles.viewer2);
  const [myComponentCss, SetmyComponentCss] = useState(styles.MyComponent);
  const [webviewerCss, SetwebviewerCss] = useState(styles.webviewer);
  useEffect(() => {
    import('@pdftron/webviewer').then(() => {
      WebViewer(
        {
          path: '/webviewer/lib',
          initialDoc: '/files/10.pdf',
        },
        viewer.current
      ).then((instance) => {
        //save instance state, will use it for search
        Setinstance(instance);
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
        //search button
        const closeSearch = () => {
          instance.closeElements(['searchPanel', 'searchOverlay']);
        };
        //Display uploaded file , receive file from FileUploader.jsx
        db.recentFiles
          .orderBy('created_at')
          .last()
          .then((result) => {
            if (result.file) {
              instance.UI.loadDocument(result.file);
            }
          });

        // Webviewer header (note panel, zoom in , zoom out, search buttons)
        instance.UI.setHeaderItems(function (header) {
          header.update([
            {
              type: 'toggleElementButton',
              img: 'icon-header-sidebar-line',
              element: 'leftPanel',
              dataElement: 'leftPanelButton',
            },
            { type: 'divider' },
            { type: 'toolButton', toolName: 'Pan' },
            {
              type: 'actionButton',
              img: 'icon-header-zoom-in-line',
              onClick: zoomIn,
              dataElement: 'zoomInButton',
            },
            {
              type: 'actionButton',
              img: 'icon-header-zoom-out-line',
              onClick: zoomOut,
              dataElement: 'zoomButton',
            },
            {
              type: 'toggleElementButton',
              img: 'ic_search_black_24px',
              onClick: closeSearch,
              element: 'searchPanel',
              dataElement: 'searchPanelButton',
            },
          ]);
          header.getHeader('toolbarGroup-Annotate').delete('toolsOverlay');
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

        documentViewer.addEventListener('documentLoaded', () => {
          instance.UI.addSearchListener(searchListener());
        });
      });
    });
  }, []);
  //Click on new keyWord trigger new search
  useEffect(() => {
    const searchPattern = keyWord;
    const searchOptions = {
      caseSensitive: false, // match case
      wholeWord: true, // match whole words only
      wildcard: false, // allow using '*' as a wildcard value
      regex: false, // string is treated as a regular expression
      searchUp: false, // search from the end of the document upwards
      ambientString: true, // return ambient string as part of the result
    };
    if (instance != null) {
      instance.UI.searchTextFull(searchPattern, searchOptions);
      instance.closeElements(['searchPanel', 'searchOverlay']);
      SetmyComponentCss(styles.MyComponent2);
      Setviewer2Css(styles.viewer2_1);
      SetwebviewerCss(styles.webviewer2);
    }
  }, [keyWord]);

  useEffect(() => {
    import('@pdftron/webviewer').then(() => {
      WebViewer(
        {
          path: '/webviewer/lib',
          initialDoc: '/files/10.pdf',
        },
        viewer2.current
      ).then((instance2) => {
        // //save instance state, will use it for search
        Setinstance2(instance2);
        // //Below are members of Core Class and will be using in Search & Highlight
        const { annotationManager, documentViewer, Annotations } =
          instance2.Core;

        //Display uploaded file , receive file from FileUploader.jsx
        db.recentFiles
          .orderBy('created_at')
          .last()
          .then((result) => {
            if (result.file) {
              instance2.UI.loadDocument(result.file);
            }
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

        documentViewer.addEventListener('documentLoaded', () => {
          instance2.UI.addSearchListener(searchListener());
        });
      });
    });
  }, []);
  //Click on new keyWord trigger new search
  useEffect(() => {
    const searchPattern = keyWord;
    const searchOptions = {
      caseSensitive: false, // match case
      wholeWord: true, // match whole words only
      wildcard: false, // allow using '*' as a wildcard value
      regex: false, // string is treated as a regular expression
      searchUp: false, // search from the end of the document upwards
      ambientString: true, // return ambient string as part of the result
    };
    if (instance2 != null) {
      instance2.UI.searchTextFull(searchPattern, searchOptions);
    }
  }, [keyWord]);
  return (
    <div className={myComponentCss}>
      <div className={viewer2Css} ref={viewer2}></div>
      <div className={webviewerCss} ref={viewer}></div>
    </div>
  );
}
