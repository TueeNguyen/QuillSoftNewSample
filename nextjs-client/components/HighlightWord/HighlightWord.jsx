export default function HighlightWord(props) {
  const { searchWords, textToHighlight, keyWordSelected } = props;
  let subString = [];
  // searchWords.forEach((element, index) => {
  //   if (keyWordSelected.includes(element) && keyWordSelected != element) {
  //     subString.push(element);
  //     searchWords.splice(index, 1);
  //   }
  // });
  console.log(searchWords);
  const highLightWords = searchWords
    .filter((keyword) => {
      return keyword !== "";
    })
    .sort((i, j) => j.length - i.length);
  console.log(highLightWords);
  const color = [
    "#a34712",
    "#f3ff33",
    "#e285f5",
    "#c8fae9",
    "#f5e385",
    "#fe4164",
    "#fcf7c2",
    "#9cff33",
    "#dffac8",
    "#ff33e9",
    "#fefce5",
    "#33fffc",
    "#33e0ff",
    "#c8d9fa",
    "#fac8e9",
    "#c0f7a7",
    "#a7f3f7",
    "#85f5d8",
    "#85aaf5",
    "#eb9234",
    "#ebc034",
    "#e5eb34",
    "#34ebae",
    "#34c3eb",
    "#3480eb",
    "#eb34eb",
    "#eb34d3",
    "#eb3471",
    "#12a325",
    "#4ca312",
    "#88a312",

    ,
  ];
  let tempArray = [];
  let keyValue = 0;
  for (let i = 0; i < highLightWords.length; i++) {
    tempArray[i] = [highLightWords[i], color[i]];
  }

  return textToHighlight && highLightWords.length ? (
    <div>
      {textToHighlight
        .split(
          new RegExp(
            `(\b?<=${highLightWords.join("|")})|(?=${highLightWords.join("|")})`
          )
        )
        .map((str) => {
          if (highLightWords.includes(str)) {
            let colorIndex = 0;
            for (let i = 0; i < tempArray.length; i++) {
              if (tempArray[i][0] == str) {
                colorIndex = i;
              }
            }
            return (
              <span
                key={`${str}` + `${keyValue++}`}
                style={{ backgroundColor: color[colorIndex] }}
              >
                {str}
                {console.log(str)}
              </span>
            );
          } else {
            return str;
          }
        })}
    </div>
  ) : (
    <>{textToHighlight || ""}</>
  );
}

//(\btest[\s.])
