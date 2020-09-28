## The Blog Title

**Markdown Test**

### Code Sample

> Gets highlighted!

This is simple

_Just kidding, this took me hours to get right_

```jsx
class CodeBlock extends PureComponent {
  static defaultProps = {
    language: null
  };

  render() {
    const { language, value } = this.props;
    return (
      <SyntaxHighlighter language={language} style={ThemeColor}>
        {value}
      </SyntaxHighlighter>
    );
  }
}
```
