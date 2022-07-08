export default function HighlightWord(props) {
  const { searchWords, textToHighlight } = props;
  const color = [
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
  ];

  return (
    <div>
      {searchWords.map((word, idx) => {
        const regex = new RegExp(`(${word})`, "gi");
        const parts = textToHighlight.split(regex);
        return (
          <div key={`${word}` + idx}>
            <br />

            {parts.filter(String).map((part, i) => {
              return regex.test(part) ? (
                <span
                  key={`${part}` + i}
                  style={{ backgroundColor: color[idx] }}
                >
                  {part}
                </span>
              ) : (
                <span key={i}> {part}</span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
