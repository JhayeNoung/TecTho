// The <pre> HTML element stands for preformatted text. 
// It is used to display text exactly as it is written in the HTML source code, 
// preserving white spaces, line breaks, and formatting.
const JsonViewer = ({ data }: { data: any }) => (
    <pre style= {{ whiteSpace: "pre-wrap" }}> { JSON.stringify(data, null, 2) } </pre>
);

// MANUAL FORMATTING
// const json = JSON.stringify(data, null, 2);
// const lines = json.split("\n");

export default JsonViewer;