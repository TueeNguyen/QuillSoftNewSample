import { useEffect, useRef, useState } from 'react';
import db from '../db';
import SearchContainer from '../SearchContainer/SearchContainer';
import styles from '../../styles/Home.module.css';
import { getFullText } from '../keyWordProcessing';
export default function ParsePDF4(props) {
  const viewer = useRef(null);
  const searchTerm = useRef(null);
  const scrollView = useRef(null);
  const searchButton = useRef(null);
  const searchContainerRef = useRef(null);
  const [instance, Setinstance] = useState(null);
  const [documentViewer, setDocumentViewer] = useState(null);
  const [annotationManager, setAnnotationManager] = useState(null);
  const [searchContainerOpen, setSearchContainerOpen] = useState(false);
  const [searchPanelCss, setsearchPanelCss] = useState(styles.searchPanelleft);
  const [myComponentCss, SetmyComponentCss] = useState(styles.MyComponent);
  const [webviewerCss, SetwebviewerCss] = useState(styles.webviewer);
  const [keyConceptOnClick, SetkeyConceptOnClick] = useState('');
  const { keyWord, xmlData, keyConcept } = props;
  const Annotations = window.Core.Annotations;
  const fullText = getFullText(xmlData);
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
        const { documentViewer } = instance.Core;
        // documentViewer.setViewerElement(viewer.current);
        documentViewer.setScrollViewElement(scrollView.current);
        setDocumentViewer(documentViewer);
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
              type: 'actionButton',
              img: 'ic_search_black_24px',
              onClick: closeSearch,
              ref: searchButton,
              dataElement: 'searchPanelButton',
            },
          ]);
        });

        documentViewer.addEventListener('documentLoaded', () => {
          // instance.UI.addSearchListener(searchListener());
          setDocumentViewer(documentViewer);
          setAnnotationManager(documentViewer.getAnnotationManager());
        });
      });
    });
  }, []);

  useEffect(() => {
    if (keyWord != '' && searchTerm.current == null) {
      closeSearch();
    }
    setTimeout(() => {
      if (searchTerm.current != null) {
        searchTerm.current.value = keyWord;
        searchButton.current.click();
        let downEv = new KeyboardEvent('keyup', { keyCode: 13, which: 13 });
        searchTerm.current.dispatchEvent(downEv);
      }
    }, 300);
  }, [keyWord]);
  useEffect(() => {
    if (keyConcept != '') {
      SetkeyConceptOnClick(keyConcept);
    }
  }, [keyConcept]);
  const closeSearch = () => {
    setSearchContainerOpen((prevState) => !prevState);
    setsearchPanelCss(styles.searchPanelleft2);
    SetmyComponentCss(styles.MyComponent2);
    SetwebviewerCss(styles.webviewer2);
  };

  return (
    <div className={myComponentCss}>
      <SearchContainer
        Annotations={Annotations}
        annotationManager={annotationManager}
        documentViewer={documentViewer}
        searchTermRef={searchTerm}
        searchContainerRef={searchContainerRef}
        open={searchContainerOpen}
        keyWord={keyWord}
        className={searchPanelCss}
        searchButton={searchButton}
        fullText={fullText}
        instance={instance}
        keyConceptOnClick={keyConceptOnClick}
      />

      <div
        className={webviewerCss}
        ref={viewer}
        style={{ height: '100vh' }}
      ></div>
    </div>
  );
}
