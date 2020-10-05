export default function StyleBlock(props) {
  if (typeof window !== 'undefined') {
    const lightValue = 'none';
    const darkValue = 'invert(1) hue-rotate(180deg)';

    var initialValue = lightValue;
    if (window.matchMedia('(prefers-color-scheme)').media !== 'not all' && window.matchMedia('(prefers-color-scheme: dark)').matches)
      initialValue = darkValue;

    const [value, setValue] = React.useState(initialValue);
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => setValue(e.matches ? lightValue : darkValue));

    return (
      <>
        <style jsx global>{`
          html {
            transition: color 300ms, background-color 300ms;
            filter: ${value};
          }
          html img:not(#social-icon){
            filter: ${value};
          }
          #social-icon {
            margin: 0 auto;
            width: 15px;
          }
          #no-border {
            border: 0;
            text-align: center;
          }
        `}</style>
        {props.children}
      </>
    );
  } else
    return <>{props.children}</>;
}
