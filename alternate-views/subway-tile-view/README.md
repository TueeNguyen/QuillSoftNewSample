## SUBWAY TILE VIEW
### Live Demo: https://l06q0.csb.app/

This view includes a subway tile representation of the keywords. Upon selecting a concept, the right-most grid is populated with the
corresponding keywords. 

### Highlighting a concept: 
Each time a concept is selected from the tabs, that concept is highlighted on the document in green.
Highlighting a new concept is simple: select another concept from the tab.

### Highlighting a keyword: 
A single keyword can be highlighted at a time by clicking on the circle representing that keyword <br/>
Two things will happen: <br/>
   - a) The keyword will be highlighted in purple throughout the document <br/>
   - b) The currently highlighted keyword and its occurences are represented on the top right grid below the document title. <br/>

For this alternate view, only one keyword can be highlighted at a time.

### Reading the TreeMap:
The treemap occurences represents the number of times the concept appears on the document. The treemap data is non-clickable and
simply there to show information.

### Important Notes:
- The occurences value is not always correct. This is because the values are calculated manually by searching the TEI.XML data and 
counting the number of times the word appears in the text.
