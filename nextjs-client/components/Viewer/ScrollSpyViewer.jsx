import React, { useEffect } from 'react';
import { Grid, Card } from "@material-ui/core/";

const {useState} = React;

export default function SliderView(props) {
    const [teiBody, setTeiBody] = useState("");
    const [active, setActive] = useState([]);
    const [inactive, setInactive] = useState([]);

    useEffect(() => {
        //extract list of phrases
        let temp = [];
        Object.keys(props.clusters).forEach((key) => {
            temp.push(key);
        });

        //format TEI/XML response
        let bodyText = props.tei;
        temp.forEach(concept => {
            let id = concept.replace(/ /g, "");
            id = startWithNumber(id) ? 'n'+ id : id;
            let find = concept.replace(/[-\\()\[\]{}^$*+.?|]/g, '\\$&');
            var regex = new RegExp('(\\s|^|[>])(?:' + find + ')(?=\\s|$|[,.:;<>])', "ig");
            bodyText = bodyText.replace(regex, "$1" + `<span class="highlight" id="${id}">${concept}</span>`);
        });
        setTeiBody(bodyText);
    });

    const callbackFunction = (entries) => {
        let selected = [];
        entries.forEach(entry => {
			const id = entry.target.getAttribute('id');
            if (entry.intersectionRatio > 0) {
                selected.push(id);
                let tohighlight = document.querySelectorAll(`#${id}`);
                tohighlight.forEach(function(item) {
                    item.classList.add('highlight-word');
                });
            } else {
                if (!selected.includes(id)) {
                    let toremovehighlight = document.querySelectorAll(`#${id}`);
                    toremovehighlight.forEach(function (item) {
                        item.classList.remove('highlight-word');
                    });
                }
			}
        });
        
        let tmpActive = [];
        let tmpInactive = [];
        phrases.forEach(concept => {
            let id = startWithNumber(concept) ? 'n'+ concept : concept;
            if (selected.includes(id.replace(/ /g, ""))) tmpActive.push(concept);
            else tmpInactive.push(concept);
        });
        setActive(sort(tmpActive));
        setInactive(sort(tmpInactive));
    }
    const options = {
        root: null,
        rootMargin: "0px",
        threshold: 0
    }

    const sort = (entries) => {
        entries.sort(function (a, b) {
            return b.split(" ").length - a.split(" ").length
        });
        return entries;
    }

    const startWithNumber = (value) => {
        return value[0].match(/^\d/);
    }

    useEffect(() => {
        //Set the observer
        const observer = new IntersectionObserver(callbackFunction, options);
        document.querySelectorAll('span[id]').forEach((section) => {
            observer.observe(section);
        });
        return () => {
            document.querySelectorAll('span[id]').forEach((section) => {
                observer.unobserve(section);
            });
        }

    }, [options])

    return (
        <Grid container spacing={2}>
            <Grid item xs={8} className="grid-style">
                <Card className="card-style">
                    <div dangerouslySetInnerHTML={{ __html: teiBody }} />
                </Card>
            </Grid>
            <Grid item xs={4} className="grid-style">
                <Card className="card-style">
                    <nav className="section-nav">
                        <ol id="active-list">
                            {active.map((value, index) => {
                                let id = startWithNumber(value) ? 'n'+ value : value;
                                return <li className="active" key={index}><a href={`#${id.replace(/ /g, "")}`}>{value}</a></li>
                            })}
                        </ol>
                        <ol id="inactive-list">
                            {inactive.map((value, index) => {
                                let id = startWithNumber(value) ? 'n'+ value : value;
                                return <li key={index}><a href={`#${id.replace(/ /g, "")}`}>{value}</a></li>
                            })}
                        </ol>
                    </nav>
                </Card>
            </Grid>
        </Grid>
    );
}