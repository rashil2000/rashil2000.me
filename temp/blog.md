## Implementing a dead-simple dark mode

This is intended to be a **markdown sample** to see if everything's in order.

The code below gets highlighted, which is pretty neat.

> This was supposed to be easy.

_- Me, after spending an entire day on 'this'_

Okay, so here's how the dark mode works:

- Since this page uses SSG, we need to make sure that the following snippet of code runs only on the client side. This is simpy done by checking if the `window` object is defined.
- We put in a simple color-inverting CSS property to change the theme, defining the variables for each. This would only work if your webpage is as simple and minimal as this.
- `useState` hook is used to initialize the state. The initial (default) value is taken to be the system-preferred theme, or *light* if the media query isn't available.
- An event listener is added which listens to changes done (exernally) to the system theme. Based on this, the `setValue` function gets fired.
- All other React functions are wrapped under this block so that they inherit these styles.

### The Code

Time for some technical _mumbo-jumbo_.

```jsx
export default function StyleBlock(props) {
  if (typeof window !== 'undefined') {
    const lightValue = 'none';
    const darkValue = 'invert(1) hue-rotate(180deg)';

    const [value, setValue] = React.useState((window.matchMedia('(prefers-color-scheme)').media !== 'not all' && window.matchMedia('(prefers-color-scheme: dark)').matches) ? darkValue : lightValue);

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
```

I have a very bad sense of humour please don't mind.
