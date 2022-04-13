var dataset = undefined;
var cluster = undefined;
var doctext = undefined;

(function() {
    
    let htmlTable = undefined;

    let start_table = function(text){
        htmlTable += "<table border='1' width='100%' id='tblData'>";
    };

    let end_table = function(text){
        htmlTable += "</table>";
    };

    let add_table_head = function(){
        htmlTable += "<tr><th>Concepts</th><th>Sentences</th></tr>";
    };

    let add_table_section = function(i, title){
        htmlTable += "<tr><th colspan='2'>Section" + i + " - " + title + "</th></tr>";
    };

    let add_table_content = function(text){
        htmlTable += "<tr><td style='border: 1px solid rgb(204, 204, 204); text-align: left; margin: 0px; padding: 6px 13px;'><span style='color: rgb(255, 65, 60);'>" + text + "</span></td></tr>";
    };

    let add_concepts_row = function(concepts, length) {
        var innerTable = '';
        innerTable += "<table border='1'>"
        concepts.forEach(function(concept) {
            innerTable += "<tr><td style='border: 1px solid rgb(204, 204, 204); text-align: left; margin: 0px; padding: 6px 13px;'><span style='color: rgb(255, 65, 60);'>" + concept + "</span></td></tr>";
        });
        innerTable += "</table>"

        htmlTable += "<tr><td rowspan='" + (length + 1) + "'>" + innerTable + "</td><td></td></tr>";
    };

    let add_sentences_row = function(sentences) {
        var innerTable = '';
        innerTable += "<table border='1'>"
        sentences.forEach(function(sentence) {
            innerTable += "<tr><td style='border: 1px solid rgb(204, 204, 204); text-align: left; margin: 0px; padding: 6px 13px;'><span style='color: rgb(255, 65, 60);'>" + sentence + "</span></td></tr>";
        });
        innerTable += "</table>"

        htmlTable += "<tr><td></td><td rowspan='2'>" + innerTable + "</td></tr>";
    };

    let summary_view = function(sel) {
        htmlTable = '';
        start_table();
        if (sel == 0) {
            add_table_head();
            add_concepts_row(dataset.concepts, dataset.detailedSummary.length);
            
            dataset.detailedSummary.forEach(function(sentence) {
                add_table_content(sentence);
            });
        } else if(sel == 1) {
            let i = 1;
            dataset.sections.forEach(function(section) {
                innerTable = '';
                add_table_section(i, section.title);
                add_table_head();
                add_concepts_row(section.concepts, section.detailedSummary.length);

                section.detailedSummary.forEach(function(sentence) {
                    add_table_content(sentence);
                });
                i++;
            });
        } else {
            let si = 1;
            dataset.sections.forEach(function(section) {
                let pi = 1;
                add_table_section(si, section.title);
                section.paragraphs.forEach(function(paragraph) {
                    innerTable = '';
                    htmlTable += "<tr><th colspan='2'>Paragraph" + pi + "</th></tr>";
                    add_table_head();
                    add_concepts_row(paragraph.concepts, paragraph.detailedSummary.length);

                    paragraph.detailedSummary.forEach(function(sentence) {
                        add_table_content(sentence);
                    });
                    pi++;
                });
                si++;
            });
        }
        end_table();
        document.getElementById("demo").innerHTML = htmlTable;
      };

    let build_concepts = function(array_sentences, array_concepts)
    {
        var concepts = [];
        array_concepts.forEach(concept => {
          var sentences = [];
          array_sentences.forEach(sentence => {
			let conceptTmp = (typeof concept) === 'string' ? concept.toLowerCase() : concept[0].toLowerCase();
            if (sentence.toLowerCase().includes(conceptTmp.toLowerCase())) {
                sentences.push(sentence);
            }
          });
          concepts.push({concept:concept, sentences:sentences});
        });
        return concepts;
    };

    let concept_view = function(sel) {
        htmlTable = '';
        start_table();
		//Document
        if (sel == 0) {
            /*add_table_head();
            var doc = build_concepts(dataset.detailedSummary, dataset.concepts);
            doc.forEach(function(row) {
                add_sentences_row(row.sentences);
                add_table_content(row.concept);
            });*/
			
			/*htmlTable += "<tr><th>Cluster</th><th>Keywords</th><th>Sentences</th></tr>";
			htmlTable += "<tr><td><table>";
			let index = 1;
			dataset.concepts.forEach(concept => {
				htmlTable += `<tr><td><a href='#' onclick="draw_clusters('${concept}');return false;">${index}- ${concept}</a></td></tr>`;
				index++;
			});
			htmlTable += "</table></td>";
			htmlTable += "<td><table id='tblCluster'><tbody></tbody></table></td>" +
				"<td><table id='tblSentences'><tbody></tbody></table></td>" +
				"</tr>";*/
				
			
			htmlTable += "<tr><td width=50%>Clusters</td><td width=50%>Text</td></tr>";
			htmlTable += `<tr><td width=50% valign='top'><table>`;
			
			let index = 1;
			htmlTable += `<tr><td><a href="#" onclick="restartHighlight();return false;">Clean Text</a> <br/></td></tr>`;
			dataset.concepts.forEach(element => {
				htmlTable += `<tr><td><a href="#" onclick="draw_clusters('${element}');return false;">${index}- ${element}</a></td></tr>`;
				index++;
			});
			htmlTable += `</table>`;
			htmlTable += `<table id='tblCluster'><tbody></tbody></table></td>`;
			
			let htmlText = '';
			doctext.forEach(element => {
				htmlText += element;
				htmlText += '<br/>';
			});
			
			dataset.concepts.forEach(element => {
				htmlText = highlightText(htmlText, element, 1);
			});
			
			htmlTable += `<td width=50%><table>`;
			
			htmlTable += `<tr><td><div id='divText'>${htmlText}</div></td></tr>`;
			
			htmlTable += `</table></td></tr>`;
			
		//Section
        } else if(sel == 1) {
            let i = 1;
            dataset.sections.forEach(function(section) {
                var doc = build_concepts(section.detailedSummary, section.concepts)
                add_table_section(i, section.title);
                add_table_head();
                doc.forEach(function(row) {
                    add_sentences_row(row.sentences);
                    add_table_content(row.concept);
                });
                i++;
            });
		//Paragraph
        } else {
            let si = 1;
            dataset.sections.forEach(function(section) {
                let pi = 1;
                add_table_section(si, section.title);
                section.paragraphs.forEach(function(paragraph) {
                    var doc = build_concepts(paragraph.detailedSummary, paragraph.concepts);
                    htmlTable += "<tr><th colspan='2'>Paragraph" + pi + "</th></tr>";
                    add_table_head();
                    doc.forEach(function(row) {
                        add_sentences_row(row.sentences);
                        add_table_content(row.concept);
                    });
                    pi++;
                });
                si++;
            });
        }
        end_table();
        document.getElementById("demo").innerHTML = htmlTable;
    };

    let load_data = function() {
        document.getElementById('load-label').innerHTML = "Processing File...";
        $.ajax({
            type: 'GET',
            url: 'http://localhost:5000/api/process',
            dataType: 'json',
            success: function (data) {
                dataset = data;
				load_text();
                document.getElementById('load-label').innerHTML = "Ready!";
            }, error: function () {
                document.getElementById('load-label').innerHTML = "Error!";
                }
        });
    };
	
	let load_text = function() {
        $.ajax({
            type: 'GET',
            url: 'http://localhost:5000/api/text',
            dataType: 'json',
            success: function (data) {
                doctext = data;
            }, error: function () {

			}
        });
    };

    var importPdf = function () {
        event.preventDefault();
    
        var fileExtension = ['pdf'];
        var filename = $('#fUpload').val();
    
        if (filename.length === 0) {
            alert("Please select a file.");
            return false;
        }
        else {
            var extension = filename.replace(/^.*\./, '');
            if ($.inArray(extension, fileExtension) == -1) {
                alert("Only PDF files are allowed.");
                return false;
            }
        }
    
        var form = $('#uploadForm')[0];
        console.log("FORM: " + form);
        var data = new FormData(form);
    
        $.ajax({
            type: "POST",
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            cache: false,
            url: "http://localhost:5000/api",
            data: data,
            success: function (resp) {
                if (resp == "file uploaded successfully") {
                    alert("File uploaded!");    
                }
                else {
                    alert("error, try again");
                }
            },
            error: function () {
                alert("error, try again");
            }
        });
    };

    let setBehaviour = function() {
        //Upload PDF
        $("#btnPdfUpload").click(function () {
            importPdf();
        });

        //Load JSON data
        let loadButton = document.querySelector('#load-button');
        loadButton.onclick = function(){
            load_data();
        };

        //Filter API response
        //let selectedView = document.querySelector('#rtype');
        let selectedView = document.getElementsByName('rtype');
        let selectedBlock = document.querySelector('#block-type');
        selectedBlock.onchange = function(){
            if (selectedView[0].checked){
                summary_view(selectedBlock.value);
            } else {
                concept_view(selectedBlock.value);
            }
        };
    };
	
    window.onload = setBehaviour;

})();


let highlightText = function(text, word, level) {

	const search = word;
	
	let color = '';
	switch (level) {
		case 1: color = 'highlight'; break;
		case 2: color = 'highlight1'; break;
		default: color = 'highlight'; break;
	}

	const searchRegExp = new RegExp(search, 'g'); // Throws SyntaxError
	const replaceWith = `<span class='${color}'>${word}</span>`;

	const result = text.replace(searchRegExp, replaceWith);
	return result;
}

let restartHighlight = function() {

	var inputText = document.getElementById("divText");
	
	let htmlText = '';
	doctext.forEach(element => {
		htmlText += element;
		htmlText += '<br/>';
	});
	
	dataset.concepts.forEach(element => {
		htmlText = highlightText(htmlText, element, 1)
	});
	
	inputText.innerHTML = htmlText;
}

let addHighlight = function(words) {

	var inputText = document.getElementById("divText");
	
	var innerHTML = inputText.innerHTML;
	
	words.forEach(element => {
		innerHTML = highlightText(innerHTML, element, 2)
	});
	
	inputText.innerHTML = innerHTML;
}

/*Export to Excel*/
let exportTableToExcel = function(tableID){
	var downloadLink;
	var dataType = 'application/vnd.ms-excel';
	var tableSelect = document.getElementById(tableID);
	var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
	
	// Specify file name
	filename = 'excel_data.xls';
	
	// Create download link element
	downloadLink = document.createElement("a");
	
	document.body.appendChild(downloadLink);
	
	if(navigator.msSaveOrOpenBlob){
		var blob = new Blob(['\ufeff', tableHTML], {
			type: dataType
		});
		navigator.msSaveOrOpenBlob( blob, filename);
	}else{
		// Create a link to the file
		downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
	
		// Setting the file name
		downloadLink.download = filename;
		
		//triggering the function
		downloadLink.click();
	}
}

let draw_clusters = function(concept) {
	
	let params = {'phrase': concept,
			'phrases': dataset.concepts
		   };
	
	document.getElementById('load-label').innerHTML = "Clustering Concept...";
	
	$.ajax({
		type: 'POST',
		url: 'http://localhost:5000/api/cluster',
		dataType: 'json',
		data: params,
		success: function (data) {
			
			let index = 1;
			cluster = data;
			$("#tblCluster tr").remove();
			$("#tblSentences tr").remove();
			$('#tblCluster').find('tbody').append(`<tr><td><b>${concept}</b></td></tr>`);
			cluster.forEach(element => {
				//$('#tblCluster').find('tbody').append(`<tr><td><a href="#" onclick="draw_sentences('${element}');return false;">${index}- ${element}</a></td></tr>`);
				$('#tblCluster').find('tbody').append(`<tr><td>${index}- ${element}</td></tr>`);
				index++;
			});
			restartHighlight();
			addHighlight(cluster);
			
			document.getElementById('load-label').innerHTML = "Ready!";
			
		}, error: function () {
			document.getElementById('load-label').innerHTML = "Error!";
		}
	});
}

let draw_sentences = function(concept) {
	
	let params = {'phrase': concept,
			'phrases': cluster
		   };
	
	document.getElementById('load-label').innerHTML = "Getting Sentences...";
	$.ajax({
		type: 'POST',
		url: 'http://localhost:5000/api/sentences',
		dataType: 'json',
		data: params,
		success: function (data) {
			let index = 1;
			cluster = data;
			$("#tblSentences tr").remove();
			$('#tblSentences').find('tbody').append(`<tr><td><b>${concept}</b></td></tr>`);
			cluster.forEach(element => {
				$('#tblSentences').find('tbody').append(`<tr><td>${index}- ${element}</td></tr>`);
				index++;
			});
			document.getElementById('load-label').innerHTML = "Ready!";
			
		}, error: function () {
			document.getElementById('load-label').innerHTML = "Error!";
		}
	});
}