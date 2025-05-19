import React from "react";
import ReactDOM from "react-dom";
import { TextAnnotator } from "react-text-annotate";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

const Card = ({ children }) => (
  <div
    style={{
      boxShadow: "0 2px 4px rgba(0,0,0,.1)",
      margin: 6,
      maxWidth: 600,
      padding: 16,
      borderRadius: 8,
      backgroundColor: "#fff",
    }}
  >
    {children}
  </div>
);

class App extends React.Component {
  state = {
    value: [],
    tag: "",
    tags: {},
    newTagName: "",
    newTagColor: "#ffcc00",
    text: "",
    isTextSubmitted: false,
  };

  handleChange = (value) => {
    this.setState({ value });
  };

  handleTagChange = (e) => {
    this.setState({ tag: e.target.value });
  };

  handleAddTag = () => {
    const { newTagName, newTagColor, tags } = this.state;
    if (newTagName && !tags[newTagName]) {
      this.setState({
        tags: { ...tags, [newTagName]: newTagColor },
        newTagName: "",
        newTagColor: "#ffcc00",
        tag: newTagName,
      });
    }
  };

  handleTextSubmit = () => {
    if (this.state.text.trim()) {
      this.setState({ isTextSubmitted: true, value: [] });
    }
  };

  render() {
    const { tag, tags, value, text, isTextSubmitted } = this.state;

    return (
      <div style={{ padding: 24, fontFamily: "IBM Plex Sans" }}>
        <h1 className="text-center">Text Annotation</h1>
        {/* Step 1: Add Tags */}
        <Card>
          <h4>Step 1: Add Tags</h4>
          <input
            type="text"
            placeholder="Tag name"
            value={this.state.newTagName}
            onChange={(e) => this.setState({ newTagName: e.target.value })}
            className="form-control mb-2"
          />
          <input
            type="color"
            value={this.state.newTagColor}
            onChange={(e) => this.setState({ newTagColor: e.target.value })}
            className="form-control mb-2"
          />
          <button className="btn btn-success" onClick={this.handleAddTag}>
            Add Tag
          </button>
          {Object.keys(tags).length > 0 && (
            <div className="mt-3">
              <label className="form-label">Select Tag</label>
              <select
                onChange={this.handleTagChange}
                value={tag}
                className="form-select"
              >
                {Object.entries(tags).map(([tagName]) => (
                  <option key={tagName} value={tagName}>
                    {tagName}
                  </option>
                ))}
              </select>
            </div>
          )}
        </Card>

        {/* Step 2: Add Text */}
        <Card>
          <h4>Step 2: Enter Text</h4>
          <textarea
            rows="6"
            className="form-control mb-2"
            placeholder="Enter text to annotate..."
            value={text}
            onChange={(e) => this.setState({ text: e.target.value })}
          />
          <button
            className="btn btn-primary"
            onClick={this.handleTextSubmit}
            disabled={!text.trim()}
          >
            Submit Text
          </button>
        </Card>

        {/* Step 3: Annotate */}
        {isTextSubmitted && (
          <Card>
            <h4>Step 3: Annotate</h4>
            <TextAnnotator
              style={{
                fontFamily: "IBM Plex Sans",
                maxWidth: 600,
                lineHeight: 1.5,
              }}
              content={text}
              value={value}
              onChange={this.handleChange}
              getSpan={(span) => ({
                ...span,
                tag: tag,
                color: tags[tag],
              })}
              renderMark={(props) => (
                <mark
                  key={props.key}
                  style={{
                    padding: ".2em .3em",
                    margin: "0 .25em",
                    lineHeight: "1",
                    display: "inline-block",
                    borderRadius: ".25em",
                    background: props.color || "#a6e22d",
                  }}
                >
                  {props.content}
                  <span
                    style={{
                      fontSize: "0.7em",
                      fontWeight: "500",
                      marginLeft: "6px",
                    }}
                  >
                    {props.tag}
                  </span>
                </mark>
              )}
            />
          </Card>
        )}

        {/* Step 4: Display Annotations */}
        {value.length > 0 && (
          <Card>
            <h5>Annotations</h5>
            {value.map((ann, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: ann.color,
                  padding: "8px",
                  marginBottom: "6px",
                  borderRadius: "4px",
                }}
              >
                <strong>{ann.tag}</strong>: {text.slice(ann.start, ann.end)}
              </div>
            ))}
          </Card>
        )}
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
